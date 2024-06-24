import React from 'react'
import { type DaSummaryEntry } from '~/server/features/data-availability/get-da-summary-entries'

interface Props {
  daBridge: DaSummaryEntry['daBridge']
}
export function DaBridgeCell({ daBridge }: Props) {
  if (!daBridge) return 'No bridge'

  if (daBridge.type === 'OnChain') {
    return (
      <div>
        {daBridge.name} on{' '}
        <span className="capitalize">{daBridge.network}</span>
      </div>
    )
  }

  return (
    <div>
      {daBridge.name} {daBridge.requiredMembers}/{daBridge.totalMembers}
    </div>
  )
}
