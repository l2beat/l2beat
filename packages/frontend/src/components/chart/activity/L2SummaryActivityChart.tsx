import { formatActivityCount } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { ActivityMetricContextProvider } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { L2SummaryChartHeader } from '~/pages/layer2s/summary/components/L2SummaryChartHeader'
import { getSummaryActivityFetchRange } from '~/pages/layer2s/summary/l2SummaryConstants'
import {
  computeWeeklyAverageChange,
  WEEK_DAYS,
} from '~/server/features/home/homeSeries'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import {
  L2RecategorizedActivityChart,
  RECATEGORISED_ACTIVITY_CHART_META,
} from './L2RecategorizedActivityChart'

interface Props {
  range: ChartRange
  /** The range as written after the change, e.g. "1y". */
  period: string
}

const hiddenDataKeys = ['others'] as const

export function L2SummaryActivityChart({ range, period }: Props) {
  const trpc = useTRPC()
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    RECATEGORISED_ACTIVITY_CHART_META,
    hiddenDataKeys,
  )

  const { data, isLoading } = useQuery(
    trpc.activity.recategorisedChart.queryOptions({
      range: getSummaryActivityFetchRange(range),
      filter: { type: 'all' },
    }),
  )

  // The days before the range only feed the first trailing weeks.
  const shown = useMemo(() => data && withinRange(data, range), [data, range])
  const weekly = useMemo(
    () => data && withinRange(toTrailingWeekTotals(data), range),
    [data, range],
  )
  const stats = getStats(shown?.data, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <L2SummaryChartHeader
        title="Activity"
        link={{ href: '/layer2s/activity', label: 'Details' }}
        value={
          stats !== undefined
            ? formatActivityCount(countPerSecond(stats.latest))
            : undefined
        }
        unit="UOPS"
        change={stats?.change}
        period={period}
      />
      <ActivityMetricContextProvider>
        {/* Says what the line is, so it never reads as the figure above. */}
        <div className="relative">
          <span className="absolute top-0 right-0 font-medium text-label-value-12 text-secondary leading-3">
            7-day average
          </span>
          <L2RecategorizedActivityChart
            isPlaceholderData={false}
            data={weekly}
            bucketDays={WEEK_DAYS}
            isLoading={isLoading}
            milestones={[]}
            compact
            chartMeta={RECATEGORISED_ACTIVITY_CHART_META}
            interactiveLegend={{
              dataKeys,
              onItemClick: toggleDataKey,
            }}
          />
        </div>
      </ActivityMetricContextProvider>
    </div>
  )
}

function getStats(
  data: RecategorisedActivityChartData['data'] | undefined,
  dataKeys: (keyof typeof RECATEGORISED_ACTIVITY_CHART_META)[],
) {
  if (!data) {
    return undefined
  }

  const pointsWithData = data.filter(
    ([_, rollupsUops, validiumsAndOptimiumsUops, othersUops]) => {
      return (
        rollupsUops !== null &&
        validiumsAndOptimiumsUops !== null &&
        othersUops !== null
      )
    },
  ) as [
    number,
    number,
    number,
    number,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ][]
  const latestData = pointsWithData.at(-1)

  if (!latestData) {
    return undefined
  }

  const sumVisible = ([
    ,
    rollups,
    vAndO,
    others,
  ]: (typeof pointsWithData)[number]) =>
    (dataKeys.includes('rollups') ? rollups : 0) +
    (dataKeys.includes('validiumsAndOptimiums') ? vAndO : 0) +
    (dataKeys.includes('others') ? others : 0)

  return {
    latest: sumVisible(latestData),
    // Week against week, as on the home page: single days swing too much.
    change: computeWeeklyAverageChange(
      pointsWithData.map((point) => [
        point[0],
        countPerSecond(sumVisible(point)),
      ]),
    ),
  }
}

/**
 * Each day's total over the week up to it, so the chart draws the trend
 * rather than every day's swing, as home's charts do. A day whose week lacks
 * a value has none, so a gap never reads as a drop.
 */
function toTrailingWeekTotals(
  data: RecategorisedActivityChartData,
): RecategorisedActivityChartData {
  const rows = data.data.map((row, end) => {
    const week = data.data.slice(end + 1 - WEEK_DAYS, end + 1)
    const [timestamp, ...columns] = row
    const totals = columns.map((_, i) =>
      week.length === WEEK_DAYS && week.every((day) => day[i + 1] !== null)
        ? week.reduce((sum, day) => sum + (day[i + 1] ?? 0), 0)
        : null,
    )
    return [timestamp, ...totals] as (typeof data.data)[number]
  })
  return { ...data, data: rows }
}

function withinRange(
  data: RecategorisedActivityChartData,
  [from]: ChartRange,
): RecategorisedActivityChartData {
  if (from === null) return data
  return { ...data, data: data.data.filter(([timestamp]) => timestamp >= from) }
}
