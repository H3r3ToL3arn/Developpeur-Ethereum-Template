import React from 'react'
import { useState, useEffect } from "react"
import useEth from "../contexts/EthContext/useEth"
import Header from './Header'
import Workflow from './Workflow/Workflow'

function Voting() {
    const { state: { contract, accounts, web3 } } = useEth();
    const [contractOwner, setOwner] = useState("");
    const [workflowStatus, setWorkflowStatus] = useState(null);
    const [isRegistered, setIsRegistered] = useState(null);

    const getOwner = async () => {
        const deployer = await contract.methods.owner().call();
        setOwner(deployer);
    };

    const getWorkflowStatus = async () => {
        const value = await contract.methods.workflowStatus().call();
        if (value > 5) {
            alert('Error : wrong workflow status. Please contact site administrator')
        } else {
            setWorkflowStatus(value);
        }
    }

    const getIsRegistered = async () => {
        const voter = await contract.methods.isRegistered(accounts[0]).call();
        setIsRegistered(voter);
    }

    useEffect(() => {
        if (web3) {
            const subscription = web3.eth
                .subscribe("newBlockHeaders", function (error, result) { })
                .on("connected", function (subscriptionId) {
                    getOwner();
                    getWorkflowStatus();
                    getIsRegistered();
                })
                .on("data", function (blockHeader) {
                    getOwner();
                    getWorkflowStatus();
                    getIsRegistered();
                })
                .on("error", console.error);
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [web3])

    return (
        <>
            {contract && (
                <>
                    <Header
                        workflowStatus={workflowStatus}
                        isOwner={contractOwner === accounts[0]}
                        isRegistered={isRegistered}
                    />
                    <hr />
                    <Workflow
                        workflowStatus={workflowStatus}
                        isOwner={contractOwner === accounts[0]}
                        isRegistered={isRegistered}
                    />
                </>
            )}
        </>
    )
}

export default Voting;












