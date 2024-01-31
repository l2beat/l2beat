import React from 'react'

import { GovernanceEventEntry } from '../../../pages/governance/getGovernanceEventEntry'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  events: GovernanceEventEntry[]
  className?: string
}

export function GovernanceEventsSection({ events, className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <GovernanceCardHeader>Governance Events</GovernanceCardHeader>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {events.map((event, i) => (
          <Event event={event} key={i} />
        ))}
      </div>
    </GovernanceCard>
  )
}

function Event({ event }: { event: GovernanceEventEntry }) {
  return (
    <GovernanceCard type="secondary">
      <p className="text-lg font-bold">{event.title}</p>
      <div className="mt-6">
        <p className="text-2xs font-medium text-opacity-50">DATE</p>
        <p className="whitespace-pre text-sm font-bold">{event.date}</p>
      </div>
      <div className="mt-3">
        <p className="text-2xs font-medium text-opacity-50">PLACE</p>
        <p className="text-sm font-bold">{event.location}</p>
      </div>
    </GovernanceCard>
  )
}
