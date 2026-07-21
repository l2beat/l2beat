import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import type { ActivityProjectChartStats } from '~/server/features/scaling/activity/buildActivityProjectChartStats'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { formatUopsRatio } from '~/utils/number-format/formatUopsRatio'

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
        label={`Max. ${metricUi.rateLabel}`}
        tooltip={`Shows the maximum sustained ${metricUi.rateLabel}, calculated as an average over the count for a day.`}
        className="max-md:h-7"
        isLoading={isLoading}
      >
        {metricStats?.maxCount !== undefined ? (
          <div className="flex gap-1 max-md:flex-row-reverse max-md:items-baseline md:flex-col">
            <div>{formatActivityCount(metricStats.maxCount.value)}</div>
            <div className="font-medium text-label-value-14 text-secondary">
              {formatTimestamp(metricStats.maxCount.timestamp)}
            </div>
          </div>
        ) : (
          'No data'
        )}
      </ChartStatsItem>
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
    </ChartStats>
  )
}
