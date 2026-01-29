import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ScalingAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ScalingAssetCategoryTvsChart'
import { ScalingBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ScalingBridgeTypeTvsChart'
import { TvsChartHeader } from '~/components/chart/tvs/TvsChartHeader'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import { api } from '~/trpc/React'
import { ChartTabs } from '../../summary/components/ChartTabs'
import { useScalingTvsTimeRangeContext } from './ScalingTvsTimeRangeContext'

interface Props {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
  entries: ScalingTvsEntry[]
  milestones: Milestone[]
}

export function ScalingTvsCharts({ tab, entries, milestones }: Props) {
  const { display } = useTvsDisplayControlsContext()
  const { state: filters } = useTableFilterContext()
  const { range, setRange } = useScalingTvsTimeRangeContext()
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
    range,
    filter,
    excludeAssociatedTokens: display.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
  })

  const timeRange = getChartTimeRangeFromData(
    data?.chart.map(([timestamp]) => ({
      timestamp,
    })),
  )
  const stats = getStats(data?.chart)

  const byBridgeTypeChart = (
    <ScalingBridgeTypeTvsChart
      unit={unit}
      filter={filter}
      range={range}
      excludeAssociatedTokens={display.excludeAssociatedTokens}
      excludeRwaRestrictedTokens={display.excludeRwaRestrictedTokens}
      milestones={milestones}
    />
  )

  const byAssetSourceChart = (
    <ScalingAssetCategoryTvsChart
      unit={unit}
      filter={filter}
      range={range}
      excludeAssociatedTokens={display.excludeAssociatedTokens}
      excludeRwaRestrictedTokens={display.excludeRwaRestrictedTokens}
      milestones={milestones}
    />
  )

  return (
    <div>
      <TvsChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={range}
        timeRange={timeRange}
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
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartRangeControls range={range} setRange={setRange} />
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
        number | null,
        number | null,
      ][]
    | undefined,
) {
  const pointsWithData = data?.filter(
    ([
      _,
      __,
      native,
      canonical,
      external,
      ether,
      stablecoin,
      btc,
      other,
      rwaRestricted,
      rwaPublic,
    ]) =>
      native !== null &&
      canonical !== null &&
      external !== null &&
      ether !== null &&
      stablecoin !== null &&
      btc !== null &&
      other !== null &&
      rwaRestricted !== null &&
      rwaPublic !== null,
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
