// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint[] public winningProposalID;
    uint256 private maxVoteCount;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] public proposalsArray;
    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //
    function isRegistered(address _addr) external view returns (bool) {
        return voters[_addr].isRegistered;
    }

    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposalsArray;
    }

    function getOneProposal(uint _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    function getProposalCount() external view returns (uint) {
        return proposalsArray.length;
    }

    function getWinner() external view returns (uint[] memory) {
        return winningProposalID;
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres
        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    function setVote(uint _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint
        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        // for (uint256 i = 0; i < proposalsArray.length; i++) {
        //     if (proposalsArray[i].voteCount == maxVoteCount) {
        //         winningProposalID.push(i);
        //     } else if (proposalsArray[i].voteCount > maxVoteCount) {
        //         delete winningProposalID;
        //         maxVoteCount = proposalsArray[i].voteCount;
        //         winningProposalID.push(i);
        //     }
        // }
        Proposal memory proposal = proposalsArray[_id];
        if (proposal.voteCount < maxVoteCount) {
            return;
        } else {
            if (proposal.voteCount > maxVoteCount) {
                maxVoteCount = proposal.voteCount;
                delete (winningProposalID);
            }
            winningProposalID.push(_id);
        }
        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    function goToNextStatus() external onlyOwner {
        require(uint256(workflowStatus) + 1 < 6, "This voting session is over");
        WorkflowStatus _previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus(uint256(workflowStatus) + 1);
        emit WorkflowStatusChange(_previousStatus, workflowStatus);
    }

    // function startProposalsRegistering() external onlyOwner {
    //     require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
    //     workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

    //     Proposal memory proposal;
    //     proposal.description = "GENESIS";
    //     proposalsArray.push(proposal);

    //     emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    // }

    // function endProposalsRegistering() external onlyOwner {
    //     require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
    //     workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
    //     emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    // }

    // function startVotingSession() external onlyOwner {
    //     require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
    //     workflowStatus = WorkflowStatus.VotingSessionStarted;
    //     emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    // }

    // function endVotingSession() external onlyOwner {
    //     require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
    //     workflowStatus = WorkflowStatus.VotingSessionEnded;
    //     emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    // }

    //    function tallyVotes() external onlyOwner {
    //        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
    //        uint _winningProposalId;
    //       for (uint256 p = 0; p < proposalsArray.length; p++) {
    //            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
    //                _winningProposalId = p;
    //           }
    //        }
    //        winningProposalID = _winningProposalId;

    //        workflowStatus = WorkflowStatus.VotesTallied;
    //        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    //     }
}
