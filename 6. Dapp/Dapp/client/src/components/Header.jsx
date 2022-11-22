import React from 'react'
import StatusButton from './StatusButton'
import { workflowsName } from '../data/workflowsName.js'

export default function Header({ isOwner, workflowStatus, isRegistered }) {

  return (
    <>
      <h1>Voting APP</h1>
      {isRegistered ? (
        <div>Congrats ! You're registered for this vote</div>
      ) : (
        <div>You're not registered for this vote</div>
      )}
      <div>Current workflow status : {workflowsName[workflowStatus]}</div>
      <br />
      {
        (isOwner && (workflowStatus !== "5")) && (
          <>
            <StatusButton
              workflowStatus={workflowStatus}
            />
            <br />
          </>
        )
      }
    </>
  )
}
