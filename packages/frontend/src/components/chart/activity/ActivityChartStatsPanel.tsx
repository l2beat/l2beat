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

export function ActivityChartStatsPanel({ stats, metric, isLoading }: Props) {
  const metricUi = METRIC_UI[metric]
  const metricStats = stats?.[metric]
  const totalCount = metricStats?.totalCount
  const pastDayRatio = getPastDayRatio(stats)
  const showTotalCount =
    metricUi.showTotalWithoutData || totalCount !== undefined

  return (
    <ChartStats className="mt-4 max-md:gap-y-2.5 md:grid-cols-2 lg:grid-cols-4">
      <ChartStatsItem
        label={`Past day ${metricUi.rateLabel}`}
        className="max-md:h-7"
        tooltip={`${metricUi.subject} per second averaged over the past day, shown together with a percentage change compared to 7 days ago.`}
        isLoading={isLoading}
      >
        {metricStats?.pastDayCount !== undefined &&
        metricStats.pastDayCount !== null ? (
          <ValueWithPercentageChange
            showPeriod
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
        label={`Past day ${metricUi.countLabel} count`}
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
          // A figure with a date under it: the label aligns with the figure.
          className="max-md:items-start"
          isLoading={isLoading}
        >
          {totalCount ? (
            <div className="flex flex-col gap-1 max-md:items-end">
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
        label={`Max ${metricUi.rateLabel}`}
        tooltip={`Shows the maximum sustained ${metricUi.rateLabel}, calculated as an average over the count for a day.`}
        className="max-md:items-start"
        isLoading={isLoading}
      >
        {metricStats?.maxCount !== undefined ? (
          <div className="flex flex-col gap-1 max-md:items-end">
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
        label="Past day UOPS/TPS ratio"
        className="max-md:h-7"
        tooltip="The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction."
        isLoading={isLoading}
      >
        {pastDayRatio !== undefined ? formatUopsRatio(pastDayRatio) : 'No data'}
      </ChartStatsItem>
    </ChartStats>
  )
}

function getPastDayRatio(stats: ActivityProjectChartStats | undefined) {
  const txs = stats?.tps.pastDaySum
  const uops = stats?.uops.pastDaySum
  if (
    txs === undefined ||
    txs === null ||
    uops === undefined ||
    uops === null
  ) {
    return undefined
  }
  return txs === 0 ? 1 : uops / txs
}
