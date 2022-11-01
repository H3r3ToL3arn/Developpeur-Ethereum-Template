const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
    BN, // Using instead chai equality matchers that support BN, see https://hardhat.org/hardhat-chai-matchers/docs/reference#numbers
    expectRevert,
    expectEvent,  // Don't work with Ethers.js, using chai expect().to.emit() instead
} = require('@openzeppelin/test-helpers');


describe("Main voting testing scope", function () {
    let voting, owner, voter1, voter2, voter3, anon;

    before("Deploy the contract instance first", async function () {

        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
        await voting.deployed();

        [owner, voter1, voter2, voter3, anon] =
            await ethers.getSigners();
    })

    it("Should set the ownner to the deployer of the contract", async function () {
        expect(await voting.owner()).to.equal(owner.address);
    })

    it("Should revert if anyone else than the owner try to start Proposal registering sessions", async function () {
        await expectRevert(
            voting.connect(anon).startProposalsRegistering(),
            'Ownable: caller is not the owner',
        )
    })

    it("Should revert if anyone else than the owner try to end Proposal registering sessions", async function () {
        await expectRevert(
            voting.connect(anon).endProposalsRegistering(),
            'Ownable: caller is not the owner',
        )
    })

    it("Should revert if anyone else than the owner try to start voting sessions", async function () {
        await expectRevert(
            voting.connect(anon).startVotingSession(),
            'Ownable: caller is not the owner',
        )
    })

    it("Should revert if anyone else than the owner try to end voting sessions", async function () {
        await expectRevert(
            voting.connect(anon).endVotingSession(),
            'Ownable: caller is not the owner',
        )
    })

    it("Should revert if anyone else than the owner try to tally votes", async function () {
        await expectRevert(
            voting.connect(anon).tallyVotes(),
            'Ownable: caller is not the owner',
        )
    })

    it("Should revert if an unregistered person try to get voter info", async function () {
        await expectRevert(
            voting.connect(anon).getVoter(voter3.address),
            "You're not a voter",
        )
    })

    it("Should revert if an unregistered person try to get proposal info", async function () {
        await expectRevert(
            voting.connect(anon).getOneProposal(0),
            "You're not a voter",
        )
    })

    it("Should revert if admin try to add Voter after Registration period", async function () {
        await voting.startProposalsRegistering()
        await expectRevert(
            voting.addVoter(voter3.address),
            'Voters registration is not open yet',
        )
    })


    context("Registration tests", function () {
        before("Deploy a new contract instance", async function () {

            const Voting = await ethers.getContractFactory("Voting");
            voting = await Voting.deploy();
            await voting.deployed();

            [owner, voter1, voter2, voter3] =
                await ethers.getSigners();
        })

        it("Should register a voter", async () => {
            await voting.addVoter(voter1.address);
            let addedVoter = await voting.connect(voter1).getVoter(voter1.address);
            expect(addedVoter[0]).to.equal(true);
        })

        it("Should not register an already registered voter", async () => {
            await expectRevert(
                voting.addVoter(voter1.address),
                'Already registered',
            )
        })

        it("Should not register if sender is not owner", async () => {
            await expectRevert(
                voting.connect(voter2).addVoter(voter2.address),
                'Ownable: caller is not the owner',
            )
        })

        it("Should emit a VoterRegistered event when user is registered", async () => {
            await expect(voting.addVoter(voter2.address))
                .to.emit(voting, 'VoterRegistered').withArgs(voter2.address);
        })
    })


    context("Proposal tests", function () {
        before("Deploy a new contract instance", async function () {

            const Voting = await ethers.getContractFactory("Voting");
            voting = await Voting.deploy();
            await voting.deployed();

            [owner, voter1, voter2, voter3, anon] =
                await ethers.getSigners();

            await voting.addVoter(voter1.address);
            await voting.addVoter(voter2.address);
        })

        it("Should revert if proposal registering session haven't started", async () => {
            await expectRevert(
                voting.connect(voter2).addProposal('proposal description'),
                'Proposals are not allowed yet',
            )
        })


        context("Proposal test with right workflow status", function () {
            it("Should emit a WorkflowStatusChange event, ProposalRegistrationStarted", async function () {
                await expect(voting.startProposalsRegistering())
                    .to.emit(voting, 'WorkflowStatusChange').withArgs(0, 1);
            })

            it("Should revert if proposal is empty", async () => {
                expectRevert(voting.connect(voter2).addProposal(''),
                    'Vous ne pouvez pas ne rien proposer',
                )
            })

            it("Should revert if sender is not registered", async () => {
                expectRevert(voting.connect(anon).addProposal('Proposal description'),
                    "You're not a voter",
                )
            })

            it("Should store a proposal, get the description", async () => {
                await voting.connect(voter1).addProposal('Voter1 proposal description');
                const proposal = await voting.connect(voter1).getOneProposal(1)
                expect(proposal.description).to.equal('Voter1 proposal description')
            })

            it("Should emit ProposalRegistered event when adding a proposal", async () => {
                await expect(voting.connect(voter1).addProposal('Voter1 proposal description'))
                    .to.emit(voting, 'ProposalRegistered').withArgs(2);
            })

            it("Should let the same user store 10 proposal, get one by ID", async () => {
                await voting.connect(voter2).addProposal('Voter2 proposal description 1');
                await voting.connect(voter2).addProposal('Voter2 proposal description 2');
                await voting.connect(voter2).addProposal('Voter2 proposal description 3');
                await voting.connect(voter2).addProposal('Voter2 proposal description 4');
                await voting.connect(voter2).addProposal('Voter2 proposal description 5');
                await voting.connect(voter2).addProposal('Voter2 proposal description 6');
                await voting.connect(voter2).addProposal('Voter2 proposal description 7');
                await voting.connect(voter2).addProposal('Voter2 proposal description 8');
                await voting.connect(voter2).addProposal('Voter2 proposal description 9');
                await voting.connect(voter2).addProposal('Voter2 proposal description 10');
                const proposal = await voting.connect(voter2).getOneProposal(10)
                expect(proposal.description).to.equal('Voter2 proposal description 8');
            })

            it("Should let one user get proposal description submitted by other user", async () => {
                const proposal = await voting.connect(voter1).getOneProposal(7)
                await expect(proposal.description).to.equal('Voter2 proposal description 5')
            })

            it("Should emit a WorkflowStatusChange event, ProposalRegistrationEnded", async function () {
                await expect(voting.endProposalsRegistering())
                    .to.emit(voting, 'WorkflowStatusChange').withArgs(1, 2);
            })

            it("Should revert if proposal session is ended", async () => {
                await expectRevert(
                    voting.connect(voter2).addProposal('Voter2 out of session proposal'), "Proposals are not allowed yet",
                )
            })
        })
    })


    context("Vote tests", function () {
        before("Deploy a new contract instance", async function () {

            const Voting = await ethers.getContractFactory("Voting");
            voting = await Voting.deploy();
            await voting.deployed();

            [owner, voter1, voter2, voter3, anon] =
                await ethers.getSigners();

            await voting.addVoter(voter1.address);
            await voting.addVoter(voter2.address);
            await voting.addVoter(voter3.address);
        })

        it("Should revert if voting session haven't started", async () => {
            await expectRevert(
                voting.connect(voter2).setVote(1),
                'Voting session havent started yet',
            )
        })


        context("Vote test with right workflow status", function () {
            before("Set proposals, start the vote session", async function () {

                await voting.startProposalsRegistering();
                await voting.connect(voter1).addProposal('Voter1 proposal description 1');
                await voting.connect(voter2).addProposal('Voter2 proposal description 1');
                await voting.connect(voter3).addProposal('Voter3 proposal description 1');
                await voting.connect(voter3).addProposal('Voter3 proposal description 2');
                await voting.connect(voter2).addProposal('Voter2 proposal description 2');
                await voting.connect(voter1).addProposal('Voter1 proposal description 2');
                await voting.connect(voter2).addProposal('Voter2 proposal description 3');
                await voting.connect(voter1).addProposal('Voter1 proposal description 3');
                await voting.connect(voter2).addProposal('Voter2 proposal description 4');
                await voting.connect(voter3).addProposal('Voter3 proposal description 3');
                await voting.endProposalsRegistering();
            })

            it("Should emit a WorkflowStatusChange event, VotingSessionsStarted", async function () {
                await expect(voting.startVotingSession())
                    .to.emit(voting, 'WorkflowStatusChange').withArgs(2 , 3);
            })

            it("Should revert if voter isn't registered", async () => {
                await expectRevert(
                    voting.connect(anon).setVote(1),
                    "You're not a voter",
                )
            })

            it("Should set a vote and change voter's votedProposalID", async function () {
                await voting.connect(voter1).setVote(1)
                const voter = await voting.connect(voter1).getVoter(voter1.address)
                await expect(voter.votedProposalId).to.equal(1)
            })

            it("Should not let user set a vote if he already did", async function () {
                await expectRevert(voting.connect(voter1).setVote(1),
                    'You have already voted',
                )
            })

            it("Should not let user vote if ProposalID is unknown", async function () {
                await expectRevert(voting.connect(voter2).setVote(1337),
                    'Proposal not found',
                )
            })

            it("Should increment proposal vote count on a vote", async function () {
                const initialVoteCount = await voting.connect(voter1).getOneProposal(1)
                await voting.connect(voter2).setVote(1)
                const newVoteCount = await voting.connect(voter1).getOneProposal(1)
                await expect(initialVoteCount.voteCount).to.equal(newVoteCount.voteCount - 1)
            })

            it("Should emit a Voted event", async function () {
                await expect(voting.connect(voter3).setVote(1))
                    .to.emit(voting, 'Voted').withArgs(voter3.address, 1);
            })

            it("Should emit a WorkflowStatusChange event, VotingSessionEnded", async function () {
                await expect(voting.endVotingSession())
                    .to.emit(voting, 'WorkflowStatusChange').withArgs(3, 4);
            })
        })
    })


    context("Ending session test", function () {
        before("Deploy a new contract instance", async function () {

            const Voting = await ethers.getContractFactory("Voting");
            voting = await Voting.deploy();
            await voting.deployed();

            [owner, voter1, voter2, voter3] =
                await ethers.getSigners();

            await voting.addVoter(voter1.address);
            await voting.addVoter(voter2.address);
            await voting.addVoter(voter3.address);
        })

        it("Should revert if voting session haven't ended", async () => {
            await expectRevert(
                voting.tallyVotes(),
                'Current status is not voting session ended',
            )
        })


        context("Ending session test with right workflow status", function () {
            before("Set proposals and votes", async () => {
                await voting.startProposalsRegistering();
                await voting.connect(voter3).addProposal('Voter3 proposal description');
                await voting.connect(voter2).addProposal('Voter2 proposal description');
                await voting.connect(voter1).addProposal('Voter1 proposal description');
                await voting.endProposalsRegistering();
                await voting.startVotingSession();
                await voting.connect(voter1).setVote(2);
                await voting.connect(voter2).setVote(3);
                await voting.connect(voter3).setVote(2);
                await voting.endVotingSession();
            })

            it("Should emit a WorkflowStatusChange event, VotesTallied", async function () {
                await expect(voting.tallyVotes())
                    .to.emit(voting, 'WorkflowStatusChange').withArgs(4, 5);
            })

            it("Should return the right winning proposal ID", async function () {
                const winningProposalId = await voting.winningProposalID.call()
                await expect(winningProposalId).to.equal(2)
            })
        })
    })


    context("Workflow status test", function () {
        before("Deploy a new contract instance", async function () {

            const Voting = await ethers.getContractFactory("Voting");
            voting = await Voting.deploy();
            await voting.deployed();

            [owner] = await ethers.getSigners();
        })

        it("Should return WorkflowStatus RegisteringVoters", async () => {
            const status = await voting.workflowStatus.call()
            await expect(status).to.equal(0)
        })

        it("Should return WorkflowStatus ProposalsRegistrationStarted", async () => {
            await voting.startProposalsRegistering()
            const status = await voting.workflowStatus.call()
            await expect(status).to.equal(1)
        })

        it("Should revert if admin try to start proposal session when it's not the right WorkflowStatus", async function () {
            await expectRevert(voting.startProposalsRegistering(), 'Registering proposals cant be started now')
        })

        it("Should return WorkflowStatus ProposalsRegistrationEnded", async () => {
            await voting.endProposalsRegistering()
            const status = await voting.workflowStatus.call()
            await expect(status).to.equal(2)
        })

        it("Should revert if admin try to end proposal session when it's not the right WorkflowStatus", async function () {
            await expectRevert(voting.endProposalsRegistering(), 'Registering proposals havent started yet')
        })

        it("Should return WorkflowStatus VotingSessionStarted", async () => {
            await voting.startVotingSession()
            const status = await voting.workflowStatus.call()
            await expect(status).to.equal(3)
        })

        it("Should revert if admin try to start voting session when it's not the right WorkflowStatus", async function () {
            await expectRevert(voting.startVotingSession(), 'Registering proposals phase is not finished')
        })

        it("Should return WorkflowStatus VotingSessionEnded", async () => {
            await voting.endVotingSession()
            const status = await voting.workflowStatus.call()
            await expect(status).to.equal(4)
        })

        it("Should revert if admin try to end voting session when it's not the right WorkflowStatus", async function () {
            await expectRevert(voting.endVotingSession(), 'Voting session havent started yet')
        })

        it("Should return WorkflowStatus VotesTallied", async () => {
            await voting.tallyVotes()
            const status = await voting.workflowStatus.call()
            await expect(status).to.equal(5)
        })

        it("Should revert if admin try TallyVotes when it's not the right WorkflowStatus", async function () {
            await expectRevert(voting.tallyVotes(), 'Current status is not voting session ended')
        })
    })
})