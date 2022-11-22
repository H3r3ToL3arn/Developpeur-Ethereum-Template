import React from 'react'
import { useState, useEffect } from 'react'
import useEth from "../contexts/EthContext/useEth"
import { workflowsName } from '../data/workflowsName.js'

export default function StatusButton({ workflowStatus }) {
    const { state: { contract, accounts } } = useEth();
    const [workflowName, setWorkflowName] = useState(null)

    const getWorkflowName = async (_workflowStatus) => {
        setWorkflowName(workflowsName[_workflowStatus]);
        return workflowName;
    }

    const goToNextStatus = async () => {
        await contract.methods.goToNextStatus().send({ from: accounts[0] });
    }

    useEffect(() => {
        getWorkflowName(workflowStatus);
    }, [workflowStatus])

    return (
        <>
            <button
                type="button"
                onClick={goToNextStatus}
            >Next step</button>
        </>
    )
}

