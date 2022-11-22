import React from 'react'
import { useState, useEffect } from 'react'
import useEth from "../../contexts/EthContext/useEth"

export default function Proposals({ isSessionEnded }) {
    const { state: { contract, web3 } } = useEth();
    const [proposalsArray, setProposalsArray] = useState([]);
    const [winnersArray, setWinnersArray] = useState([]);

    const getWinners = async () => {
        const _winnersArray = await contract.methods.getWinner().call();
        setWinnersArray(_winnersArray);
    }

    const getProposals = async () => {
        const _proposalsArray = await contract.methods.getProposals().call();
        setProposalsArray(_proposalsArray);
    }

    useEffect(() => {
        if (web3 && contract) {
            const subscription2 = web3.eth
                .subscribe("newBlockHeaders", function (error, result) { })
                .on("connected", function (subscriptionId) {
                    getProposals();
                    getWinners();
                })
                .on("data", function (blockHeader) {
                    getProposals();
                    getWinners();
                })
                .on("error", console.error);
            return () => {
                subscription2.unsubscribe();
            };
        }

    }, [web3, contract])


    return (
        <>
            {isSessionEnded && (
                <>
                    <h2> Winner are :</h2>
                    <ul>{winnersArray.map((id) => <li>Proposal N°{id}, vote count ({proposalsArray[id].voteCount}) : {proposalsArray[id].description}</li>)}
                    </ul>
                    <br />
                </>
            )}
            {(proposalsArray.length > 0) && (
                <>
                    <h2>Proposals list : </h2>
                    <ul>
                        {proposalsArray.map((proposal, id) => <li>Proposal N°{id}, vote count ({proposal.voteCount}) : {proposal.description}</li>)}
                    </ul>
                </>
            )}
        </>
    )
}


