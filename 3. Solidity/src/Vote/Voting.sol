// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

// TO DO :
// Maybe modify setVoteStatus (no choice, WorkflowStatus + 1 by default. This way, no modifier required)

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    struct EqualProposals {
        string description;
        uint256 id;
    }

    mapping(address => Voter) private whitelist;
    Proposal[] public proposals;
    EqualProposals[] private equalProposals;
    uint256 private winningProposalId;
    uint256[] private equalProposalsIds;

    enum WorkflowStatus {               // Return uint                                      
        RegisteringVoters,              // 0
        ProposalsRegistrationStarted,   // 1
        ProposalsRegistrationEnded,     // 2
        VotingSessionStarted,           // 3
        VotingSessionEnded,             // 4
        VotesTallied                    // 5
    }

    WorkflowStatus public voteStatus;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    modifier onlyWhitelisted() {
        require(
            whitelist[msg.sender].isRegistered,
            "This address is not whitelisted !"
        );
        _;
    }

    modifier checkWorkflowOrder(WorkflowStatus _requestedStatus) {
        require(
            uint256(_requestedStatus) == uint256(voteStatus) + 1,
            "Requested workflow status is not the one expected"
        );
        _;
    }

    modifier checkWorkflowStatusIs(WorkflowStatus _expectedStatus) {
        require(_expectedStatus == voteStatus, "It's not the right time");
        _;
    }

    // Whitelist administration

    function addWhitelist(address _address)
        public
        onlyOwner
        checkWorkflowStatusIs(WorkflowStatus.RegisteringVoters)
    {
        require(
            !whitelist[_address].isRegistered,
            "This address is already whitelisted !"
        );
        whitelist[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address].isRegistered;
    }

    // Workflow status

    function setVoteStatus(WorkflowStatus _status)
        public
        onlyOwner
        checkWorkflowOrder(_status)
    {
        WorkflowStatus _previousStatus = voteStatus;
        voteStatus = _status;
        emit WorkflowStatusChange(_previousStatus, _status);
    }

    // Proposal & Voting

    function addProposal(string memory _description)
        public
        onlyWhitelisted
        checkWorkflowStatusIs(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    function getProposalsDescriptions()
        public
        view
        returns (Proposal[] memory)
    {
        return proposals;
    }

    function voteForProposal(uint256 _proposalId)
        public
        onlyWhitelisted
        checkWorkflowStatusIs(WorkflowStatus.VotingSessionStarted)
    {
        require(_proposalId < proposals.length, "Wrong proposal ID");
        require(!whitelist[msg.sender].hasVoted, "You have already voted");
        whitelist[msg.sender].hasVoted = true;
        whitelist[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        emit Voted(msg.sender, _proposalId);
    }

    // Voting results
    function getWinner() internal returns (uint256) {
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningProposalId) {
                winningProposalId = i;
            }
        }
        return winningProposalId;
    }

    function showWinnnerDescription()
        public
        checkWorkflowStatusIs(WorkflowStatus.VotesTallied)
        returns (string memory)
    {
        return proposals[getWinner()].description;
    }

    // Equality management
    function getWinnerWithEquality() internal returns (uint256[] memory) {
        uint256 maxVoteCount;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount == maxVoteCount) {
                equalProposalsIds.push(i);
            } else if (proposals[i].voteCount > maxVoteCount) {
                delete equalProposalsIds;
                maxVoteCount = proposals[i].voteCount;
                equalProposalsIds.push(i);
            }
        }
        return equalProposalsIds;
    }

    function showWinnersDescriptions()
        public
        checkWorkflowStatusIs(WorkflowStatus.VotesTallied)
        returns (EqualProposals[] memory)
    {
        for (uint256 i = 0; i < getWinnerWithEquality().length; i++) {
            equalProposals.push(
                EqualProposals(
                    proposals[equalProposalsIds[i]].description,
                    equalProposalsIds[i]
                )
            );
        }
        return equalProposals;
    }
}
