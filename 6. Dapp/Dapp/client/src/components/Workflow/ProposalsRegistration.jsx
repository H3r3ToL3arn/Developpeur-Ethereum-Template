import React from 'react'

import useEth from "../../contexts/EthContext/useEth"
import InputButton from "../InputButton"
import Proposals from "./Proposals"

export default function ProposalsRegistration({ isRegistered, isEnded }) {
    const { state: { contract, accounts } } = useEth();

    const addProposal = async (_proposal) => {
        if (_proposal === "") {
            alert("Please enter a description")
        } else {
            await contract.methods.addProposal(_proposal).send({ from: accounts[0] });
        }
    }

    return (
        <>
            {(isRegistered && !isEnded) ? (
                <>
                    <InputButton
                        buttonText={"Add proposal"}
                        actionOnSubmit={addProposal}
                    />
                    <br />
                    <Proposals
                        isSessionEnded={false}
                    />
                </>
            ) : (isRegistered && isEnded) ? (
                <>
                    <div> Proposal registration has ended, please wait for the voting session.</div>
                    <br />
                    <Proposals
                        isSessionEnded={false}
                    />
                </>
            ) : (
                <div> You're not registered</div>
            )}
        </>
    )
}