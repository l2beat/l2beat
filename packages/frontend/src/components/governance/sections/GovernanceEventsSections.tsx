import React from 'react'

import { GovernanceEventEntry } from '../../../pages/governance/getGovernanceEventEntry'
import { Badge } from '../../badge/Badge'
import { Button } from '../../Button'
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
    <GovernanceCard type="secondary" className="flex flex-col justify-between">
      <div>
        <Badge
          className="px-2 py-1 uppercase"
          type={event.status === 'past' ? 'gray' : 'purple'}
        >
          {event.status}
        </Badge>
        <p className="mt-6 text-lg font-bold">{event.title}</p>
        <div className="mt-6">
          <p className="text-2xs font-medium opacity-50">DATE</p>
          <p className="whitespace-pre text-sm font-bold">{event.date}</p>
        </div>
        <div className="mt-3">
          <p className="text-2xs font-medium opacity-50">PLACE</p>
          <p className="text-sm font-bold">{event.location}</p>
        </div>
      </div>
      <Button className="mt-6" as="a" href={event.link}>
        Learn more
      </Button>
    </GovernanceCard>
  )
}
