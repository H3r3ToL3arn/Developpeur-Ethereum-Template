import React from 'react'
import useEth from "../../contexts/EthContext/useEth"
import InputButton from "../InputButton"


export default function RegisteringVoters({ isOwner }) {
    const { state: { contract, accounts, web3 } } = useEth();

    const addVoter = async (_address) => {
        if (web3.utils.isAddress(_address)) {
            contract.methods.addVoter(_address).send({ from: accounts[0] })
                .on("receipt", function (receipt) {
                    // Check if VoterRegistered event was emitted
                    if (receipt.events.VoterRegistered) {
                        alert("Voter registered : " + receipt.events.VoterRegistered.returnValues.voterAddress);
                    } else {
                        console.err("Error : ", receipt);
                    }
                });
        } else {
            alert('This is not a valid ethereum address !');
        }
    }

    return (
        <>
            {isOwner ? (
                <InputButton
                    buttonText={"Register a voter"}
                    actionOnSubmit={addVoter}
                />
            ) : (
                <div>You're not allowed to register voters.</div>
            )}
        </>
    )
}
