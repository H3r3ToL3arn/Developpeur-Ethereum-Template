import React from 'react'
import RegisteringVoters from './RegisteringVoters';
import ProposalsRegistration from './ProposalsRegistration'
import VotingSession from './VotingSession'
import Proposals from './Proposals'

export default function Workflow({ workflowStatus, isOwner, isRegistered }) {

    return (
        <>
            {(workflowStatus === "0") ? (
                <>
                    <br />
                    <RegisteringVoters
                        isOwner={isOwner}
                    />
                </>
            ) : (workflowStatus === "1") ? (
                <>
                    <br />
                    <ProposalsRegistration
                        isRegistered={isRegistered}
                        isEnded={false}
                    />
                </>
            ) : (workflowStatus === "2") ? (
                <>
                    <br />
                    <ProposalsRegistration
                        isRegistered={isRegistered}
                        isEnded={true}
                    />
                </>
            ) : (workflowStatus === "3") ? (
                <>
                    <br />
                    <VotingSession
                        isRegistered={isRegistered}
                        isEnded={false}
                    />
                </>
            ) : (workflowStatus === "4") ? (
                <>
                    <br />
                    <VotingSession
                        isRegistered={isRegistered}
                        isEnded={true}
                    />
                </>
            ) : (workflowStatus === "5") && (
                <>
                    <br />
                    <Proposals
                        isSessionEnded={true}
                    />
                </>
            )
            }
        </>
    )
}



