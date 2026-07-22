import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import { LiveIndicator } from '~/components/LiveIndicator'
import { ChevronIcon } from '~/icons/Chevron'
import { anomalySubtypeToLabel } from '~/pages/scaling/liveness/components/AnomalyIndicator'
import type { OngoingAnomaliesOverview } from '~/server/features/scaling/liveness/getOngoingAnomaliesOverview'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { HomeCard } from './HomeCard'

export function HomeAnomaliesTile({
  ongoingAnomalies,
}: {
  ongoingAnomalies: OngoingAnomaliesOverview
}) {
  const { count, items } = ongoingAnomalies
  const isOngoing = count > 0
  const first = items[0]

  return (
    <HomeCard className="p-0">
      <a
        href="/scaling/liveness"
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-secondary/50 md:rounded-xl md:px-7 md:py-5"
      >
        <LiveIndicator size="md" disabled={!isOngoing} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-bold text-label-value-14 leading-tight transition-colors group-hover:text-link">
            Ongoing major anomalies
          </span>
          <span className="mt-0.5 flex min-w-0 items-center gap-1.5 font-medium text-label-value-12 text-secondary">
            {isOngoing && first ? (
              <>
                <img
                  src={first.iconUrl}
                  alt={first.name}
                  className="size-3.5 shrink-0 rounded-full"
                />
                <span className="truncate">
                  {`${first.name} · no ${first.subtypes
                    .map((subtype) =>
                      anomalySubtypeToLabel(subtype).toLowerCase(),
                    )
                    .join(', ')} · ${formatDuration(first.durationInSeconds)}`}
                  {count > 1 && ` · +${count - 1} more`}
                </span>
              </>
            ) : (
              <span className="truncate">
                All tracked projects are posting as expected
              </span>
            )}
          </span>
        </div>
        <span className="shrink-0 font-bold text-heading-20 tabular-nums leading-none">
          {formatInteger(count)}
        </span>
        <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
      </a>
    </HomeCard>
  )
}
