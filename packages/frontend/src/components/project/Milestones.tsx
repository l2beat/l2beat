import { Milestone } from '@l2beat/config'
import React from 'react'

export interface MilestonesProps {
  milestones: Milestone[]
}

export function Milestones({ milestones }: MilestonesProps) {
  return (
    <>
      {milestones.map((m) => (
        <div>
          <p>{m.name}</p>
          <p>{m.link}</p>
          <p>{m.date.toISOString()}</p>
          {m.description && <p>{m.description}</p>}
        </div>
      ))}
    </>
  )
}