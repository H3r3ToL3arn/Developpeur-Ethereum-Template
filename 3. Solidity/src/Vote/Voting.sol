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

    mapping(address => Voter) private whitelist;
    Proposal[] public proposals;
    Proposal[] private equalProposals;
    uint256[] private winningProposalsIds;

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

    modifier checkWorkflowStatusIs(WorkflowStatus _expectedStatus) {
        require(_expectedStatus == voteStatus, "It's not the right time");
        _;
    }

    // Whitelist administration
    // Admin can whitelist user if registering session is in progress and the user is not already whitelisted
    function addWhitelist(address _address)
        external
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

    // Everyone can verify if an address is whitelisted
    function isWhitelisted(address _address) external view returns (bool) {
        return whitelist[_address].isRegistered;
    }

    // Workflow status
    // Admin can update the workflow status and go to the next status, until the last one
    function goToNextStatus() external onlyOwner {
        WorkflowStatus _previousStatus = voteStatus;
        voteStatus = WorkflowStatus(uint256(voteStatus) + 1);
        require(uint256(voteStatus) < 6, "This voting session is over");
        emit WorkflowStatusChange(_previousStatus, voteStatus);
    }

    // Proposal & Voting
    // Whitelisted users can add one or more proposals if the proposal session is in open
    function addProposal(string calldata _description)
        external
        onlyWhitelisted
        checkWorkflowStatusIs(WorkflowStatus.ProposalsRegistrationStarted)
    {
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    // Return all the proposals with their description
    function getProposalsDescriptions()
        external
        view
        returns (Proposal[] memory)
    {
        return proposals;
    }

    // Whitelisted users can vote for a proposal if it exists, they have not already voted, and the voting session is open
    function voteForProposal(uint256 _proposalId)
        external
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

    // Voting results with equality management
    // Admin collect the IDs of the winners and their descriptions can be collected by the front via the events
    function getWinnerWithEquality()
        external
        onlyOwner
        returns (uint256[] memory)
    {
        uint256 maxVoteCount;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount == maxVoteCount) {
                winningProposalsIds.push(i);
            } else if (proposals[i].voteCount > maxVoteCount) {
                delete winningProposalsIds;
                maxVoteCount = proposals[i].voteCount;
                winningProposalsIds.push(i);
            }
        }
        return winningProposalsIds;
    }
}
