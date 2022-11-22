# Dapp Voting Alyra - Project 3

The purpose of this project is to provide full Dapp for a voting session.

## Features

- registration of a whitelist of voters.
- the administrator start the proposal registration session.
- only registered voters can register proposals.
- the administrator end proposal registration session.
- the administrator start the voting session.
- only registered voters can vote for their favorite proposals.
- the administrator end the voting session.
- the administrator count the votes.
- everyone can see the result.

## Technologies

---

This project was developped in the following environment :

- [node.js](https://github.com/nodejs/node) : Version 16.16.0
- [truffle box react](https://github.com/truffle-box/react-box)

Sources files :

- [Voting.sol](https://github.com/lecascyril/CodesRinkeby/blob/main/voting.sol)
- [VotingTest.js](https://github.com/lecascyril/CodesRinkeby/blob/main/VoteTest.js)

## Test results

---

```
❯ truffle test
Using network 'development'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


  Contract: Voting
    Add Voters Phase
      ✔ Test on only Owner (410ms)
      ✔ Add voter pass, test event
      ✔ Add voter pass, test isRegistered
      ✔ Add voter cant pass if wrong workflow
    Add Proposal Phase
      ✔ Test on require: not proposal registration state revert
      ✔ Test on require: non voter cant propose
      ✔ Test on require: voter cant propose nothing (55ms)
      ✔ Proposal pass, test on proposal description and getter getOneProposal
      ✔ Proposal pass, test on proposalRegistered event
      ✔ 1 Proposal pass, test on revert getter getOneProposal ID 1 (38ms)
      ✔ Multiple Proposal pass : concat (66ms)
    Voting Phase
      ✔ Test on require: vote cant be done if not in the right worfkflow status
      ✔ Concat : Test on requires: non voter cant propose, voter cant propose nothing, and voter cant vote twice (47ms)
      ✔ vote pass: Voter 1 vote for proposal 1: Test on event
      ✔ vote pass: Voter 1 vote for proposal 1: Test on voter attributes
      ✔ vote pass: Voter 1 vote for proposal 1: Test on proposal attributes (38ms)
      ✔ multiple vote pass: concat (76ms)
    Tallying Phase
      ✔ Tally pass, test on event on workflow status
      ✔ Tally pass, test on winning proposal description and vote count
    Worfklow status tests
      ✔ Generalisation: test on require trigger: not owner cant change workflow status
      ✔ Test on event: start proposal registering
      ✔ Test on event: end proposal registering
      ✔ Test on event: start voting session
      ✔ Test on event: end voting session (57ms)


  24 passing (3s)
```

## Demo

Video: https://youtu.be/qvKCN17bkbw

Website: https://dapp-alyra-voting3.surge.sh/

Ownership was transferred to [@lecasyril](https://github.com/lecascyril)
