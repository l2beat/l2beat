import React from 'react'

import { GovernanceEventEntry } from '../../../pages/governance/getGovernanceEventEntries'
import { cn } from '../../../utils/cn'
import { Button } from '../../Button'
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
        <ExploreAllButton className="hidden md:block" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {events.map((event, i) => (
          <Event event={event} key={i} />
        ))}
      </div>
      <ExploreAllButton className="mt-6 w-full md:hidden" />
    </GovernanceCard>
  )
}

function Event({ event }: { event: GovernanceEventEntry }) {
  return (
    <GovernanceCard
      type={event.highlighted ? 'purple' : 'secondary'}
      size="medium"
      className="flex h-[320px] flex-col justify-between"
    >
      <div>
        <div className="h-16">
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
        </div>
        <div className="mt-4">
          <p className="text-2xs opacity-50">DATE</p>
          <p className="whitespace-pre text-sm">{event.displayDate}</p>
        </div>
        <div className="mt-3">
          <p className="text-2xs opacity-50">PLACE</p>
          <p className="whitespace-pre text-sm">{event.location}</p>
        </div>
      </div>
      <Button
        as="a"
        variant={event.highlighted ? 'default' : 'purple'}
        href={event.link}
      >
        Learn more
      </Button>
    </GovernanceCard>
  )
}

function ExploreAllButton({ className }: { className?: string }) {
  return (
    <Button
      as="a"
      className={className}
      variant="purple"
      size="sm"
      href="/governance/events"
    >
      Explore all events
    </Button>
  )
}
