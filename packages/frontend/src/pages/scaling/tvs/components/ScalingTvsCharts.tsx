import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ScalingAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ScalingAssetCategoryTvsChart'
import { ScalingBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ScalingBridgeTypeTvsChart'
import { TvsChartHeader } from '~/components/chart/tvs/TvsChartHeader'
import { TvsChartTimeRangeControls } from '~/components/chart/tvs/TvsChartTimeRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { Checkbox } from '~/components/core/Checkbox'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { useScalingAssociatedTokensContext } from '../../components/ScalingAssociatedTokensContext'
import { ChartTabs } from '../../summary/components/ChartTabs'

interface Props {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
  entries: ScalingTvsEntry[]
  milestones: Milestone[]
}

export function ScalingTvsCharts({ tab, entries, milestones }: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  const { state: filters } = useTableFilterContext()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')
  const [unit, setUnit] = useState<ChartUnit>('usd')

  const filter = useMemo<TvsProjectFilter>(() => {
    if (Object.keys(filters).length === 0) {
      return {
        type: tab,
      }
    }
    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries, filters, tab])

  const { data } = api.tvs.detailedChart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
  })

  const chartRange = getChartRange(
    data?.chart.map(([timestamp]) => ({
      timestamp,
    })),
  )
  const stats = getStats(data?.chart)

  const byBridgeTypeChart = (
    <ScalingBridgeTypeTvsChart
      unit={unit}
      filter={filter}
      range={timeRange}
      excludeAssociatedTokens={excludeAssociatedTokens}
      milestones={milestones}
    />
  )

  const byAssetSourceChart = (
    <ScalingAssetCategoryTvsChart
      unit={unit}
      filter={filter}
      range={timeRange}
      excludeAssociatedTokens={excludeAssociatedTokens}
      milestones={milestones}
    />
  )

  return (
    <div>
      <TvsChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={timeRange}
        timeRange={chartRange}
      />
      <div className="mt-4 mb-3 grid grid-cols-2 gap-x-6 max-lg:hidden">
        {byBridgeTypeChart}
        {byAssetSourceChart}
      </div>
      <ChartTabs
        className="-mx-4 md:-mx-6 pb-1! lg:hidden"
        charts={[byBridgeTypeChart, byAssetSourceChart]}
      />
      <ChartControlsWrapper>
        <TvsChartUnitControls unit={unit} setUnit={setUnit}>
          <Checkbox
            name="excludeAssociatedTokens"
            checked={excludeAssociatedTokens}
            onCheckedChange={(checked) => setExcludeAssociatedTokens(!!checked)}
          >
            Exclude associated tokens
          </Checkbox>
        </TvsChartUnitControls>
        <TvsChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
    </div>
  )
}

function getStats(
  data:
    | [
        number,
        number | null,
        number | null,
        number | null,
        number | null,
        number | null,
        number | null,
        number | null,
        number | null,
      ][]
    | undefined,
) {
  const pointsWithData = data?.filter(
    ([_, __, native, canonical, external, ether, stablecoin, btc, other]) =>
      native !== null &&
      canonical !== null &&
      external !== null &&
      ether !== null &&
      stablecoin !== null &&
      btc !== null &&
      other !== null,
  ) as [
    number,
    number | null,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ][]

  const oldestDataPoint = pointsWithData?.at(0)
  const newestDataPoint = pointsWithData?.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const total = newestDataPoint[2] + newestDataPoint[3] + newestDataPoint[4]
  const oldestTotal =
    oldestDataPoint[2] + oldestDataPoint[3] + oldestDataPoint[4]
  const change = (oldestTotal === 0 ? 0 : total / oldestTotal) - 1

  return {
    total,
    change,
  }
}
