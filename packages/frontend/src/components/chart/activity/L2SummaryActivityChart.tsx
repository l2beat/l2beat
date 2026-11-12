import { formatActivityCount } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { ActivityMetricContextProvider } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { L2SummaryChartHeader } from '~/pages/layer2s/summary/components/L2SummaryChartHeader'
import { computeWeeklyAverageChange } from '~/server/features/home/homeSeries'
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
  /** Written after the change, e.g. "1y". */
  rangeLabel: string
}

const hiddenDataKeys = ['others'] as const

export function L2SummaryActivityChart({ range, rangeLabel }: Props) {
  const trpc = useTRPC()
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    RECATEGORISED_ACTIVITY_CHART_META,
    hiddenDataKeys,
  )

  const { data, isLoading } = useQuery(
    trpc.activity.recategorisedChart.queryOptions({
      range,
      filter: { type: 'all' },
    }),
  )

  const stats = getStats(data?.data, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <L2SummaryChartHeader
        title="Activity"
        link={{ href: '/layer2s/activity', label: 'By project' }}
        value={
          stats !== undefined
            ? formatActivityCount(countPerSecond(stats.latest))
            : undefined
        }
        unit="UOPS"
        change={stats?.change}
        rangeLabel={rangeLabel}
      />
      <ActivityMetricContextProvider>
        <L2RecategorizedActivityChart
          isPlaceholderData={false}
          data={data}
          isLoading={isLoading}
          milestones={[]}
          chartMeta={RECATEGORISED_ACTIVITY_CHART_META}
          interactiveLegend={{
            dataKeys,
            onItemClick: toggleDataKey,
          }}
        />
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

  const sumVisible = (point: (typeof pointsWithData)[number]) =>
    (dataKeys.includes('rollups') ? point[1] : 0) +
    (dataKeys.includes('validiumsAndOptimiums') ? point[2] : 0) +
    (dataKeys.includes('others') ? point[3] : 0)

  return {
    latest: sumVisible(latestData),
    // Weekly averages, as on the home page, so one quiet day doesn't set it.
    change: computeWeeklyAverageChange(
      pointsWithData.map((point) => [point[0], sumVisible(point)]),
    ),
  }
}
