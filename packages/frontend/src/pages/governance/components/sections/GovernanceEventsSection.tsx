import { Button } from '~/components/core/Button'
import { useDevice } from '~/hooks/useDevice'
import { cn } from '~/utils/cn'
import type { GovernanceEventEntry } from '../../utils/getGovernanceEventEntries'
import { GovernanceCard } from '../GovernanceCard'

interface Props {
  events: GovernanceEventEntry[]
  className?: string
}

export function GovernanceEventsSection({ events, className }: Props) {
  return (
    <GovernanceCard mobileFull className={className}>
      <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
        Governance events
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event, i) => (
          <Event event={event} key={i} />
        ))}
      </div>
    </GovernanceCard>
  )
}

function Event({ event }: { event: GovernanceEventEntry }) {
  const { isMobile } = useDevice()

  return (
    <GovernanceCard
      type={event.highlighted ? 'brand' : isMobile ? 'primary' : 'secondary'}
      size="medium"
      className="flex flex-col justify-start gap-4 md:h-[304px]"
    >
      <div className="flex flex-col gap-0.5 md:min-h-20">
        {event.title && (
          <p
            className={cn(
              'text-brand-deep text-subtitle-12 uppercase',
              event.highlighted && 'text-white',
            )}
          >
            {event.title}
          </p>
        )}
        <p
          className={cn(
            'line-clamp-3 font-semibold text-heading-18 text-primary',
            event.highlighted && 'text-white',
          )}
        >
          {event.subtitle}
        </p>
      </div>
      <div
        className={cn('flex flex-col gap-3', event.highlighted && 'text-white')}
      >
        <div>
          <p
            className={cn(
              'text-secondary text-subtitle-12 uppercase',
              event.highlighted && 'text-white',
            )}
          >
            Date
          </p>
          <p className="whitespace-pre-line text-sm">
            <EventDate date={event.displayDate} />
          </p>
        </div>
        {event.location && (
          <div>
            <p
              className={cn(
                'text-secondary text-subtitle-12 uppercase',
                event.highlighted && 'text-white',
              )}
            >
              Place
            </p>
            <p className="whitespace-pre-line text-sm">{event.location}</p>
          </div>
        )}
      </div>
      <Button
        variant={event.highlighted ? 'default' : 'outline'}
        className="w-full"
        size="sm"
        asChild
      >
        <a href={event.link}>Join the event</a>
      </Button>
    </GovernanceCard>
  )
}

/** A same-day date breaks after the day, never inside the time range. */
function EventDate({ date }: { date: string }) {
  const comma = date.indexOf(', ')
  if (comma === -1) return date
  return (
    <>
      <span className="whitespace-nowrap">{date.slice(0, comma + 1)}</span>{' '}
      <span className="whitespace-nowrap">{date.slice(comma + 2)}</span>
    </>
  )
}
