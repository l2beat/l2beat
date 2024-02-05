import React from 'react'

import { GovernanceEventEntry } from '../../../pages/governance/getGovernanceEventEntries'
import { cn } from '../../../utils/cn'
import { OutLinkIcon } from '../../icons'
import { Link } from '../../Link'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  events: GovernanceEventEntry[]
  className?: string
}

export function GovernanceEventsSection({ events, className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <div className="flex flex-wrap justify-between gap-2">
        <GovernanceCardHeader>Governance Events</GovernanceCardHeader>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event, i) => (
          <Event event={event} key={i} />
        ))}
      </div>
    </GovernanceCard>
  )
}

function Event({ event }: { event: GovernanceEventEntry }) {
  const hostname = new URL(event.link).hostname
  console.log(hostname)
  return (
    <GovernanceCard
      type={event.highlighted ? 'purple' : 'secondary'}
      size="medium"
      className="flex h-[288px] flex-col justify-between"
    >
      <div className="h-28">
        {event.subtitle && (
          <p
            className={cn(
              'text-xs font-semibold uppercase text-purple-100 dark:text-pink-200',
              event.highlighted && 'text-pink-200',
            )}
          >
            {event.subtitle}
          </p>
        )}
        <p className="text-lg font-semibold leading-tight">{event.title}</p>
        <Link href={event.link} className="mt-2 text-xs">
          {hostname}
          {<OutLinkIcon />}
        </Link>
      </div>
      <div>
        <div className="mt-4">
          <p className="text-2xs opacity-50">DATE</p>
          <p className="whitespace-pre text-sm">{event.displayDate}</p>
        </div>
        <div className="mt-3">
          <p className="text-2xs opacity-50">PLACE</p>
          <p className="whitespace-pre text-sm">{event.location}</p>
        </div>
      </div>
    </GovernanceCard>
  )
}
