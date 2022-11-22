import React from 'react'
import Proposals from './Proposals'
import InputButton from '../InputButton'
import useEth from "../../contexts/EthContext/useEth"

export default function VotingSession({ isRegistered, isEnded }) {
    const { state: { contract, accounts } } = useEth();

    const setVote = async (_vote) => {
        if (isNaN(_vote)) {
            alert("Input is not a number, or does not exist")
        } else {
            await contract.methods.setVote(_vote).send({ from: accounts[0] });
        }
    }
    return (
        <>
            {(isRegistered && isEnded) ? (
                <>
                    <div> Voting session has ended, admin will soon tally votes</div>
                    <br />

                    <Proposals />
                </>
            ) : (isRegistered && !isEnded) ? (
                <>
                    <div> Voting session has started, please make your choice and vote .</div>
                    <br />
                    <InputButton
                        buttonText={"Vote"}
                        actionOnSubmit={setVote}
                    />
                    <br />
                    <br />
                    <Proposals />
                </>
            ) : (
                <div> You're not registered</div>
            )}
        </>
    )
}