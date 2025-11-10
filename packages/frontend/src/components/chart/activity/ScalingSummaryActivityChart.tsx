import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { Skeleton } from '~/components/core/Skeleton'
import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import { ActivityMetricContextProvider } from '~/pages/scaling/activity/components/ActivityMetricContext'
import type { RecategorisedActivityChartData } from '~/server/features/scaling/activity/getRecategorisedActivityChart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import {
  RECATEGORISED_ACTIVITY_CHART_META,
  ScalingRecategorizedActivityChart,
} from './ScalingRecategorizedActivityChart'

interface Props {
  timeRange: ActivityTimeRange
}

const hiddenDataKeys = ['others'] as const

export function ScalingSummaryActivityChart({ timeRange }: Props) {
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    RECATEGORISED_ACTIVITY_CHART_META,
    hiddenDataKeys,
  )

  const { data, isLoading } = api.activity.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const stats = getStats(data?.data, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <Header latestUopsCount={stats} />
      <ActivityMetricContextProvider>
        <ScalingRecategorizedActivityChart
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

function Header({ latestUopsCount }: { latestUopsCount: number | undefined }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl">Activity</span>
          <a
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none max-md:hidden"
            href="/scaling/activity"
          >
            View details
            <ChevronIcon className="-rotate-90 size-[10px] fill-current" />
          </a>
        </div>
        <CustomLink
          href="/scaling/activity"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="-rotate-90 size-[10px] fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        {latestUopsCount !== undefined ? (
          <>
            <div className="whitespace-nowrap text-right font-bold text-xl">
              {formatActivityCount(countPerSecond(latestUopsCount))} UOPS
            </div>
            <div className="h-5" />
          </>
        ) : (
          <>
            <Skeleton className="my-[5px] h-5 w-20 md:w-[243px]" />
            <div className="h-5" />
          </>
        )}
      </div>
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

  const toSum = [
    dataKeys.includes('rollups') ? latestData[1] : 0,
    dataKeys.includes('validiumsAndOptimiums') ? latestData[2] : 0,
    dataKeys.includes('others') ? latestData[3] : 0,
  ]

  return toSum.reduce((acc, curr) => acc + curr, 0)
}
