import React from 'react'
import { type DataAvailabilityProvider } from './columns'

interface Props {
  daBridge: DataAvailabilityProvider['daBridge']
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
