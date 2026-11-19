import { formatActivityCount, formatNumber } from '@l2beat/shared-pure'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { RollingNumber } from '~/components/RollingNumber'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import {
  LIVE_RANGES,
  type LiveRange,
} from '~/server/features/layer2s/activity/live/liveRanges'
import { formatRange } from '~/utils/dates'
import type { getWindowStats, LiveMetric } from './liveSteps'
import { formatGas } from './liveView'

const STATS_CLASS = 'mt-4 max-md:gap-y-2.5 md:grid-cols-3 lg:grid-cols-3'
const formatBlocks = (value: number) => formatNumber(value, 1)

/** The window on screen in figures, against the same hour over the past week */
export function LiveStats({
  usual,
  metric,
  stats,
  window,
  isLoading,
}: {
  /** Per second, over the window, on the days of the past week */
  usual: number | undefined
  metric: LiveMetric
  stats: ReturnType<typeof getWindowStats>
  /** The range following the newest block, or the window looked back to */
  window: LiveRange | [number, number] | undefined
  isLoading: boolean
}) {
  const span =
    typeof window === 'string'
      ? `last ${LIVE_RANGES[window].label}`
      : window
        ? formatRange(window[0], window[1])
        : ''
  const blocks = (
    <ChartStatsItem label="Blocks per minute" isLoading={isLoading}>
      {stats && (
        <RollingNumber value={stats.blocksPerMinute} format={formatBlocks} />
      )}
    </ChartStatsItem>
  )

  if (metric === 'gas') {
    return (
      <ChartStats className={STATS_CLASS}>
        <ChartStatsItem
          label={`Gas per second, ${span}`}
          tooltip="Gas used per second over the window shown."
          isLoading={isLoading}
        >
          {stats && <RollingNumber value={stats.rate} format={formatGas} />}
        </ChartStatsItem>
        {blocks}
        <ChartStatsItem label="Gas per block" isLoading={isLoading}>
          {stats && stats.blocksPerMinute > 0 && (
            <RollingNumber
              value={(stats.gasPerSecond * 60) / stats.blocksPerMinute}
              format={formatGas}
            />
          )}
        </ChartStatsItem>
      </ChartStats>
    )
  }

  return (
    <ChartStats className={STATS_CLASS}>
      <ChartStatsItem
        label={`${metric === 'uops' ? 'UOPS' : 'TPS'}, ${span}`}
        tooltip={`${metric === 'uops' ? 'User operations' : 'Transactions'} per second over the window shown, with a percentage change compared to the median of the same hours on the days of the past week.`}
        isLoading={isLoading}
      >
        {stats && (
          <ValueWithPercentageChange
            change={
              usual !== undefined && usual > 0
                ? stats.rate / usual - 1
                : undefined
            }
            changePeriod="7D"
            className="text-sm xs:text-lg md:text-lg"
            changeClassName="text-xs"
          >
            <RollingNumber value={stats.rate} format={formatActivityCount} />
          </ValueWithPercentageChange>
        )}
      </ChartStatsItem>
      {blocks}
      <ChartStatsItem label="Gas per second" isLoading={isLoading}>
        {stats && (
          <RollingNumber value={stats.gasPerSecond} format={formatGas} />
        )}
      </ChartStatsItem>
    </ChartStats>
  )
}
