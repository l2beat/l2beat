import {
  formatActivityCount,
  formatInteger,
  formatUopsRatio,
} from '@l2beat/shared-pure'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ActivityProjectChartStats } from '~/server/features/layer2s/activity/buildActivityProjectChartStats'
import { formatTimestamp } from '~/utils/dates'

interface Props {
  stats: ActivityProjectChartStats | undefined
  metric: ActivityMetric
  lastRatio: number | null | undefined
  isLoading: boolean
}

const METRIC_UI = {
  tps: {
    rateLabel: 'TPS',
    countLabel: 'Txs',
    subject: 'Transactions',
    showTotalWithoutData: true,
  },
  uops: {
    rateLabel: 'UOPS',
    countLabel: 'Ops',
    subject: 'User operations',
    showTotalWithoutData: false,
  },
} satisfies Record<
  ActivityMetric,
  {
    rateLabel: string
    countLabel: string
    subject: string
    showTotalWithoutData: boolean
  }
>

export function ActivityChartStatsPanel({
  stats,
  metric,
  lastRatio,
  isLoading,
}: Props) {
  const metricUi = METRIC_UI[metric]
  const metricStats = stats?.[metric]
  const totalCount = metricStats?.totalCount
  const peaks = metricStats?.peaks
  const showTotalCount =
    metricUi.showTotalWithoutData || totalCount !== undefined

  return (
    <ChartStats className="mt-4 md:grid-cols-2 lg:grid-cols-4">
      <ChartStatsItem
        label={`Past Day ${metricUi.rateLabel}`}
        className="max-md:h-7"
        tooltip={`${metricUi.subject} per second averaged over the past day, shown together with a percentage change compared to 7D ago.`}
        isLoading={isLoading}
      >
        {metricStats?.pastDayCount !== undefined &&
        metricStats.pastDayCount !== null ? (
          <ValueWithPercentageChange
            change={metricStats.pastDayChange}
            changePeriod={metricStats.pastDayChangePeriod}
            className="text-sm xs:text-lg md:text-lg"
            changeClassName="text-xs"
          >
            {formatActivityCount(metricStats.pastDayCount)}
          </ValueWithPercentageChange>
        ) : (
          'No data'
        )}
      </ChartStatsItem>
      <ChartStatsItem
        label={`Past Day ${metricUi.countLabel} count`}
        className="max-md:h-7"
        isLoading={isLoading}
      >
        {metricStats?.pastDaySum !== undefined &&
        metricStats.pastDaySum !== null
          ? formatInteger(metricStats.pastDaySum)
          : 'No data'}
      </ChartStatsItem>
      {showTotalCount && (
        <ChartStatsItem
          label={`Total ${metricUi.countLabel}`}
          className="max-md:h-7"
          isLoading={isLoading}
        >
          {totalCount ? (
            <div className="flex gap-1 max-md:flex-row-reverse max-md:items-baseline md:flex-col">
              <div>{formatInteger(totalCount.value)}</div>
              <div className="font-medium text-label-value-14 text-secondary">
                since {formatTimestamp(totalCount.sinceTimestamp)}
              </div>
            </div>
          ) : (
            'No data'
          )}
        </ChartStatsItem>
      )}
      <ChartStatsItem
        label="Past day UOPS/TPS Ratio"
        className="max-md:h-7"
        tooltip="The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction."
        isLoading={isLoading}
      >
        {lastRatio !== undefined && lastRatio !== null
          ? formatUopsRatio(lastRatio)
          : 'No data'}
      </ChartStatsItem>
      {/* The maxima share a row, so they read as one comparison */}
      <ChartStatsItem
        label={`Max. ${metricUi.rateLabel} (day avg.)`}
        tooltip={`The highest ${metricUi.rateLabel}, averaged over the busiest day.`}
        className="max-md:h-7 lg:col-start-1"
        isLoading={isLoading}
      >
        {metricStats?.maxCount !== undefined ? (
          <MaxRate
            value={metricStats.maxCount.value}
            timestamp={metricStats.maxCount.timestamp}
          />
        ) : (
          'No data'
        )}
      </ChartStatsItem>
      {(isLoading || peaks !== undefined) &&
        (['hour', 'minute'] as const).map((period) => (
          <ChartStatsItem
            key={period}
            label={`Max. ${metricUi.rateLabel} (${period} avg.)`}
            tooltip={`The highest ${metricUi.rateLabel}, averaged over the busiest ${period}.${formatTrackedSince(peaks)}`}
            className="max-md:h-7"
            isLoading={isLoading}
          >
            {peaks && (
              <MaxRate
                value={peaks[period].value}
                timestamp={peaks[period].timestamp}
                sinceTimestamp={peaks.sinceTimestamp}
              />
            )}
          </ChartStatsItem>
        ))}
    </ChartStats>
  )
}

function MaxRate({
  value,
  timestamp,
  sinceTimestamp,
}: {
  value: number
  timestamp: number
  sinceTimestamp?: number
}) {
  return (
    <div className="flex gap-1 max-md:flex-row-reverse max-md:items-baseline md:flex-col">
      <div>{formatActivityCount(value)}</div>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(timestamp)}
        {/* Mobile rows have no room for it, so there it is in the tooltip */}
        {sinceTimestamp !== undefined && (
          <span className="max-md:hidden">
            {' '}
            · since {formatTimestamp(sinceTimestamp)}
          </span>
        )}
      </div>
    </div>
  )
}

function formatTrackedSince(
  peaks: { sinceTimestamp: number } | undefined,
): string {
  return peaks
    ? ` Tracked only since ${formatTimestamp(peaks.sinceTimestamp)}.`
    : ''
}
