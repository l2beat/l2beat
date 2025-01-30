'use client'
import { CustomLink } from '~/components/link/custom-link'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { CustomLinkIcon } from '~/icons/outlink'
import { cn } from '~/utils/cn'
import type { GovernanceEventEntry } from '../../_utils/get-governance-event-entries'
import { GovernanceCard, GovernanceCardHeader } from '../governance-card'

interface Props {
  events: GovernanceEventEntry[]
  className?: string
}

export function GovernanceEventsSection({ events, className }: Props) {
  return (
    <GovernanceCard mobileFull className={className}>
      <div className="flex flex-wrap justify-between gap-2">
        <GovernanceCardHeader>Governance events</GovernanceCardHeader>
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
  const isMobile = useIsMobile()

  return (
    <GovernanceCard
      type={event.highlighted ? 'purple' : isMobile ? 'primary' : 'secondary'}
      size="medium"
      className="flex flex-col justify-between md:h-[288px]"
    >
      <div className="md:h-28">
        {event.subtitle && (
          <p
            className={cn(
              'text-xs font-medium uppercase text-purple-100 dark:text-pink-200',
              event.highlighted && 'text-pink-200',
            )}
          >
            {event.subtitle}
          </p>
        )}
        <p className="text-lg font-medium leading-tight">{event.title}</p>
        <CustomLink
          href={event.link}
          className={cn('mt-2 text-xs', event.highlighted && 'text-white')}
          type={event.highlighted ? 'plain' : 'primary'}
        >
          {hostname}
          <CustomLinkIcon />
        </CustomLink>
      </div>
      <div>
        <div className="mt-4">
          <p className="text-2xs opacity-50">DATE</p>
          <p className="whitespace-pre-line text-sm">{event.displayDate}</p>
        </div>
        {event.location && (
          <div className="mt-3">
            <p className="text-2xs opacity-50">PLACE</p>
            <p className="whitespace-pre-line text-sm">{event.location}</p>
          </div>
        )}
      </div>
    </GovernanceCard>
  )
}
