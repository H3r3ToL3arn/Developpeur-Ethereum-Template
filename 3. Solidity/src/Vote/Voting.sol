// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }
    
    struct EqualProposals { 
        string description;
        uint id;
    }

    mapping(address => Voter) private _whitelist;
    Proposal[] private proposals; 
    EqualProposals[] private equalProposals;
    uint private winningProposalId;
    uint[] private equalProposalsIds;

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
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier onlyWhitelisted {
        require(_whitelist[msg.sender].isRegistered, "This address is not whitelisted !");
        _;
    }


    // Whitelist administration

    function whitelist(address _address) public onlyOwner {
        require(!_whitelist[_address].isRegistered, "This address is already whitelisted !");
        require(uint(voteStatus) == 0, "Registering period is over");
        _whitelist[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }
    
    function isWhitelisted(address _address) public view returns (bool){
        return _whitelist[_address].isRegistered;
    }


    // Admin / Workflow status 

    function setVoteStatus(WorkflowStatus _status) public onlyOwner {
        WorkflowStatus _previousStatus = voteStatus;
        voteStatus = _status;
        emit WorkflowStatusChange(_previousStatus , _status);
    }

    function getVoteStatus() public view returns(WorkflowStatus) {
        return voteStatus;
    }

    function getWinner() public onlyOwner returns(uint) {
    require(uint(voteStatus) == 5, "Voting period is not over");
       for (uint i=0 ; i<proposals.length ; i++) {
           if (proposals[i].voteCount > winningProposalId) {
               winningProposalId = i;
            }
        }
    return winningProposalId;
    }


    // Proposal & Voting

    function addProposal(string memory _description) public onlyWhitelisted {
        require(uint(voteStatus) == 1, "Proposal period is over");
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    // function getProposal() public view returns(Proposal) {
    // }

    function voteForProposal(uint _proposalId) public onlyWhitelisted {
        require(uint(voteStatus) == 3, "Voting period is over");
        require(!_whitelist[msg.sender].hasVoted, "You have already voted");
        _whitelist[msg.sender].hasVoted = true;
        _whitelist[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount ++;
        emit Voted (msg.sender, _proposalId);
    }



    // Voting results 
    function showWinnnerDescription() public returns(string memory) {
        return proposals[getWinner()].description;
    }



    // Equality management
    function getWinnerWithEquality() public onlyOwner returns(uint[] memory) {
    require(uint(voteStatus) == 5, "Voting period is not over");
    uint maxVoteCount;
        for (uint i=0 ; i<proposals.length ; i++) {
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


    function showWinnersDescriptions(uint[] memory _equalProposalsIds) public returns(EqualProposals[] memory) {
        for (uint i=0 ; i<_equalProposalsIds.length ; i++) {
            equalProposals.push(EqualProposals(proposals[equalProposalsIds[i]].description, equalProposalsIds[i]));
        }
    return equalProposals;
    }

 
}