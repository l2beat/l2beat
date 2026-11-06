import {
  formatActivityCount,
  formatInteger,
  formatUopsRatio,
} from '@l2beat/shared-pure'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ActivityProjectChartStats } from '~/server/features/layer2s/activity/buildActivityProjectChartStats'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { ActivityStats } from './ActivityStats'

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
    <ActivityStats
      isLoading={isLoading}
      headline={{
        label: `${metricUi.rateLabel}, past day`,
        tooltip: `${metricUi.subject} per second averaged over the past day, shown together with a percentage change compared to 7D ago.`,
        value:
          metricStats?.pastDayCount !== undefined &&
          metricStats.pastDayCount !== null
            ? formatActivityCount(metricStats.pastDayCount)
            : undefined,
        change: metricStats?.pastDayChange,
        changePeriod:
          metricStats && SHORT_PERIOD[metricStats.pastDayChangePeriod],
      }}
      rows={[
        {
          label: `${metricUi.countLabel}, past day`,
          value:
            metricStats?.pastDaySum !== undefined &&
            metricStats.pastDaySum !== null
              ? formatInteger(metricStats.pastDaySum)
              : undefined,
        },
        ...(showTotalCount
          ? [
              {
                label: `Total ${metricUi.countLabel.toLowerCase()}`,
                value: totalCount && formatInteger(totalCount.value),
                note:
                  totalCount &&
                  `since ${formatTimestamp(totalCount.sinceTimestamp)}`,
              },
            ]
          : []),
        {
          label: `Max. ${metricUi.rateLabel}`,
          tooltip: `Shows the maximum sustained ${metricUi.rateLabel}, calculated as an average over the count for a day.`,
          value:
            metricStats?.maxCount !== undefined
              ? formatActivityCount(metricStats.maxCount.value)
              : undefined,
          note:
            metricStats?.maxCount !== undefined
              ? formatTimestamp(metricStats.maxCount.timestamp)
              : undefined,
        },
        {
          label: 'UOPS/TPS ratio, past day',
          tooltip:
            'The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction.',
          value:
            pastDayRatio !== undefined
              ? formatUopsRatio(pastDayRatio)
              : undefined,
        },
      ]}
    />
  )
}

/** How a change's period reads beside it */
const SHORT_PERIOD: Record<PercentageChangePeriod, string> = {
  '1D': '1d',
  '7D': '7d',
  last24h: '24h',
  last7d: '7d',
  last30d: '30d',
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
