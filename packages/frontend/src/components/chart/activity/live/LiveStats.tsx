import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { RollingNumber } from '~/components/RollingNumber'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { formatRange } from '~/utils/dates'
import { formatLiveLength, LIVE_USUAL_DAYS } from '~/utils/range/liveRanges'
import {
  formatDecimal,
  hasHistory,
  LIVE_METRICS,
  type LiveMetric,
} from './liveMetrics'
import type { getWindowStats } from './liveSteps'

const USUAL = `the median of the same hours on the past ${LIVE_USUAL_DAYS} days`

/** The window on screen in figures, against the same hours on the days before */
export function LiveStats({
  usual,
  metric,
  stats,
  span,
  isLoading,
}: {
  /** Per second, over the window, on the days before */
  usual: number | undefined
  metric: LiveMetric
  stats: ReturnType<typeof getWindowStats>
  /** The length following the newest block, or the window looked back to */
  span: number | [number, number] | undefined
  isLoading: boolean
}) {
  const { rate, counted, formatRate } = LIVE_METRICS[metric]
  const spanText =
    typeof span === 'number'
      ? `last ${formatLiveLength(span)}`
      : span
        ? formatRange(span[0], span[1])
        : ''

  return (
    <ChartStats className="mt-4 max-md:gap-y-2.5 md:grid-cols-3 lg:grid-cols-3">
      <ChartStatsItem
        label={`${rate}, ${spanText}`}
        tooltip={`${counted} per second over the window shown${hasHistory(metric) ? `, with a percentage change compared to ${USUAL}` : ''}.`}
        isLoading={isLoading}
      >
        {stats && (
          <ValueWithPercentageChange
            change={
              usual !== undefined && usual > 0
                ? stats.rate / usual - 1
                : undefined
            }
            changeTooltip={`Percentage change compared to ${USUAL}.`}
            className="text-sm xs:text-lg md:text-lg"
            changeClassName="text-xs"
          >
            <RollingNumber value={stats.rate} format={formatRate} />
          </ValueWithPercentageChange>
        )}
      </ChartStatsItem>
      <ChartStatsItem label="Blocks per minute" isLoading={isLoading}>
        {stats && (
          <RollingNumber value={stats.blocksPerMinute} format={formatDecimal} />
        )}
      </ChartStatsItem>
      {/* the rate above is already gas per second */}
      {metric === 'gas' ? (
        <ChartStatsItem label="Gas per block" isLoading={isLoading}>
          {stats && stats.blocks > 0 && (
            <RollingNumber
              value={stats.gas / stats.blocks}
              format={formatDecimal}
            />
          )}
        </ChartStatsItem>
      ) : (
        <ChartStatsItem label="Gas per second" isLoading={isLoading}>
          {stats && (
            <RollingNumber value={stats.gasPerSecond} format={formatDecimal} />
          )}
        </ChartStatsItem>
      )}
    </ChartStats>
  )
}
