import { formatActivityCount } from '@l2beat/shared-pure'
import { LiveIndicator } from '~/components/LiveIndicator'
import { RollingNumber } from '~/components/RollingNumber'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'

/** The chain's rate right now, leading to the live view */
export function LiveNow({
  now,
  metric,
  onOpen,
}: {
  /** Per second, over the last minute */
  now: Record<ActivityMetric, number>
  metric: ActivityMetric
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex items-center gap-2 text-sm"
    >
      <LiveIndicator color="var(--brand)" className="ml-0 shrink-0" />
      <RollingNumber
        value={now[metric]}
        format={formatActivityCount}
        className="font-bold"
      />
      <span className="text-secondary group-hover:text-primary group-hover:underline">
        {metric === 'uops' ? 'UOPS' : 'TPS'} now
      </span>
    </button>
  )
}
