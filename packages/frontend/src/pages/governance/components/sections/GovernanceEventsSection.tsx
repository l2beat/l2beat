import { Button } from '~/components/core/Button'
import { useIsMobile } from '~/hooks/useIsMobile'
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
      <div className="heading-24 md:heading-32">Governance events</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event, i) => (
          <Event event={event} key={i} />
        ))}
      </div>
    </GovernanceCard>
  )
}

function Event({ event }: { event: GovernanceEventEntry }) {
  const isMobile = useIsMobile()

  return (
    <GovernanceCard
      type={event.highlighted ? 'purple' : isMobile ? 'primary' : 'secondary'}
      size="./Medium"
      className="flex flex-col justify-start gap-4 md:h-[304px]"
    >
      <div className="flex flex-col gap-0.5 md:min-h-20">
        {event.title && (
          <p
            className={cn(
              'subtitle-12 text-brand uppercase',
              event.highlighted && 'text-white',
            )}
          >
            {event.title}
          </p>
        )}
        <p
          className={cn(
            'heading-18 line-clamp-3 text-primary',
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
              'subtitle-12 text-secondary',
              event.highlighted && 'text-white',
            )}
          >
            DATE
          </p>
          <p className="whitespace-pre-line text-sm">{event.displayDate}</p>
        </div>
        {event.location && (
          <div>
            <p
              className={cn(
                'subtitle-12 text-secondary',
                event.highlighted && 'text-white',
              )}
            >
              PLACE
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
