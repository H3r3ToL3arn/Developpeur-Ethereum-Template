# ⚡️ Project - Voting system 2

The purpose of this project is to provide a test file for the imposed solidity contract : Voting.sol


## Project guidelines
***
> You must provide the unit tests of the provided smart contract. We do not  expect 100% coverage of the smart contract but be sure to test the different possibilities of returns (event, revert). 

### What's expected :
Your Github link with tests and quick explanation of what was done in a readme.md

### Scoring elements:
Minimally test all storage changes
* Three good test using expect, expectRevert and expectEvent
* At least once all three on the same function
* Add a readme, with details of your coverages

To improve rendering
* Use smart contexts
* Wide test coverage
* Prioritize unit tests

## Technologies
***
This project was developped in the following environment : 

* [node.js](https://github.com/nodejs/node): Version 16.16.0
* [hardhat](https://github.com/NomicFoundation/hardhat): Version 2.12.0

Hardhat include by default the [Hardhat Toolbox](https://github.com/NomicFoundation/hardhat/tree/main/packages/hardhat-toolbox) which allows us to use : 

* [ethers.js](https://docs.ethers.io/v5/): Version 5.4
* [mocha](https://github.com/mochajs/mocha): Version 10.1.0
* [chai](https://github.com/chaijs/chai): Version 4.3.6
* [hardhat gas reporter](https://github.com/cgewecke/hardhat-gas-reporter): Version 1.0.9
* [solidity coverage](https://github.com/sc-forks/solidity-coverage): Version 0.8.2

## Test results
***

```
❯ npx hardhat test

  Main voting testing scope
    ✔ Should set the ownner to the deployer of the contract
    ✔ Should revert if anyone else than the owner try to start Proposal registering sessions (42ms)
    ✔ Should revert if anyone else than the owner try to end Proposal registering sessions
    ✔ Should revert if anyone else than the owner try to start voting sessions
    ✔ Should revert if anyone else than the owner try to end voting sessions
    ✔ Should revert if anyone else than the owner try to tally votes
    ✔ Should revert if an unregistered person try to get voter info
    ✔ Should revert if an unregistered person try to get proposal info
    ✔ Should revert if admin try to add Voter after Registration period (43ms)
    Registration tests
      ✔ Should register a voter
      ✔ Should not register an already registered voter
      ✔ Should not register if sender is not owner
      ✔ Should emit a VoterRegistered event when user is registered
    Proposal tests
      ✔ Should revert if proposal registering session haven't started
      Proposal test with right workflow status
        ✔ Should emit a WorkflowStatusChange event, ProposalRegistrationStarted
        ✔ Should revert if proposal is empty
        ✔ Should revert if sender is not registered
        ✔ Should store a proposal, get the description
        ✔ Should emit ProposalRegistered event when adding a proposal
        ✔ Should let the same user store 10 proposal, get one by ID (241ms)
        ✔ Should let one user get proposal description submitted by other user
        ✔ Should emit a WorkflowStatusChange event, ProposalRegistrationEnded
        ✔ Should revert if proposal session is ended
    Vote tests
      ✔ Should revert if voting session haven't started
      Vote test with right workflow status
        ✔ Should emit a WorkflowStatusChange event, VotingSessionsStarted
        ✔ Should revert if voter isn't registered
        ✔ Should set a vote and change voter's votedProposalID
        ✔ Should not let user set a vote if he already did
        ✔ Should not let user vote if ProposalID is unknown
        ✔ Should increment proposal vote count on a vote
        ✔ Should emit a Voted event
        ✔ Should emit a WorkflowStatusChange event, VotingSessionEnded
    Ending session test
      ✔ Should revert if voting session haven't ended
      Ending session test with right workflow status
        ✔ Should emit a WorkflowStatusChange event, VotesTallied
        ✔ Should return the right winning proposal ID
    Workflow status test
      ✔ Should return WorkflowStatus RegisteringVoters
      ✔ Should return WorkflowStatus ProposalsRegistrationStarted
      ✔ Should revert if admin try to start proposal session when it's not the right WorkflowStatus
      ✔ Should return WorkflowStatus ProposalsRegistrationEnded
      ✔ Should revert if admin try to end proposal session when it's not the right WorkflowStatus (48ms)
      ✔ Should return WorkflowStatus VotingSessionStarted (69ms)
      ✔ Should revert if admin try to start voting session when it's not the right WorkflowStatus
      ✔ Should return WorkflowStatus VotingSessionEnded
      ✔ Should revert if admin try to end voting session when it's not the right WorkflowStatus
      ✔ Should return WorkflowStatus VotesTallied
      ✔ Should revert if admin try TallyVotes when it's not the right WorkflowStatus


  46 passing (3s)
```

## Test coverage
***

```
❯ npx hardhat coverage

-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts/  |      100 |      100 |      100 |      100 |                |
  Voting.sol |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
All files    |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
```


## Gas reporter 
***

```
·------------------------------------------|----------------------------|-------------|-----------------------------·
|           Solc version: 0.8.17           ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···········································|····························|·············|······························
|  Methods                                                                                                          │
·············|·····························|··············|·············|·············|···············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls      ·  eth (avg)  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  addProposal                ·       59484  ·      59520  ·      59503  ·           26  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  addVoter                   ·       50208  ·      50220  ·      50215  ·           11  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·            5  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·            4  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  setVote                    ·       60913  ·      78013  ·      68242  ·            7  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      95032  ·            6  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·            4  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Voting    ·  tallyVotes                 ·       37849  ·      66469  ·      56929  ·            3  ·          -  │
·············|·····························|··············|·············|·············|···············|··············
|  Deployments                             ·                                          ·  % of limit   ·             │
···········································|··············|·············|·············|···············|··············
|  Voting                                  ·           -  ·          -  ·    2077414  ·        6.9 %  ·          -  │
·------------------------------------------|--------------|-------------|-------------|---------------|-------------·
```