import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import { LiveIndicator } from '~/components/LiveIndicator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import type { OngoingAnomaliesOverview } from '~/server/features/scaling/liveness/getOngoingAnomaliesOverview'
import { cn } from '~/utils/cn'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'
import { OVERVIEW_WIDGET_TITLE_CLASS } from './overviewResponsive'

const MAX_VISIBLE_ANOMALIES = 3

interface Props {
  ongoingAnomalies: OngoingAnomaliesOverview
  className?: string
}

export function OverviewOngoingAnomaliesCard({
  ongoingAnomalies,
  className,
}: Props) {
  const { count, items } = ongoingAnomalies
  const isOngoing = count > 0
  const visible = items.slice(0, MAX_VISIBLE_ANOMALIES)
  const remaining = items.length - visible.length

  return (
    <PrimaryCard
      className={cn(OVERVIEW_CARD_PADDING_CLASS, 'flex flex-col', className)}
    >
      <a
        href="/scaling/liveness"
        className="group flex items-center justify-between gap-2"
      >
        <span className={OVERVIEW_WIDGET_TITLE_CLASS}>
          Ongoing major anomalies
        </span>
        <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
      </a>
      <div className="mt-1 flex items-center gap-2">
        <LiveIndicator size="md" disabled={!isOngoing} />
        <span className="font-bold text-3xl tabular-nums leading-none">
          {formatInteger(count)}
        </span>
      </div>
      {isOngoing ? (
        <ul className="mt-3 flex flex-col gap-1.5">
          {visible.map((item) => (
            <li
              key={item.slug}
              className="flex items-center justify-between gap-2 text-label-value-12"
            >
              <span className="min-w-0 truncate text-primary">{item.name}</span>
              <span className="shrink-0 text-secondary tabular-nums">
                {formatDuration(item.durationInSeconds)}
              </span>
            </li>
          ))}
          {remaining > 0 && (
            <li>
              <a
                href="/scaling/liveness"
                className="font-medium text-label-value-12 text-link"
              >
                +{remaining} more
              </a>
            </li>
          )}
        </ul>
      ) : (
        <p className="mt-2 text-label-value-12 text-secondary">
          No ongoing anomalies
        </p>
      )}
    </PrimaryCard>
  )
}
