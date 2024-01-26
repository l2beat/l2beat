import React from 'react'

import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  className?: string
}

export function GovernanceEventsSection({ className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <GovernanceCardHeader>Governance Events</GovernanceCardHeader>
    </GovernanceCard>
  )
}
