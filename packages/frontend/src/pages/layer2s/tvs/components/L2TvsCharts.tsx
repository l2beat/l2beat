import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { L2AssetCategoryTvsChart } from '~/components/chart/tvs/stacked/L2AssetCategoryTvsChart'
import { L2BridgeTypeTvsChart } from '~/components/chart/tvs/stacked/L2BridgeTypeTvsChart'
import { TvsChartHeader } from '~/components/chart/tvs/TvsChartHeader'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { CompareProjectsLink } from '~/pages/layer2s/compare/components/CompareProjectsLink'
import { getCompareEntryUrl } from '~/pages/layer2s/compare/utils/getCompareEntryUrl'
import type { L2TvsEntry } from '~/server/features/layer2s/tvs/getL2TvsEntries'
import type { TvsProjectFilter } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { useTRPC } from '~/trpc/React'
import { ChartTabs } from '../../summary/components/ChartTabs'
import { useL2TvsTimeRangeContext } from './L2TvsTimeRangeContext'

interface Props {
  entries: L2TvsEntry[]
  milestones: Milestone[]
}

export function L2TvsCharts({ entries, milestones }: Props) {
  const trpc = useTRPC()
  const { display } = useTvsDisplayControlsContext()
  const { range, setRange } = useL2TvsTimeRangeContext()
  const [unit, setUnit] = useState<ChartUnit>('usd')

  const filter = useMemo<TvsProjectFilter>(() => {
    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries])

  const { data, isPlaceholderData, shownInput } = useChartQuery(
    trpc.tvs.detailedChart,
    {
      range,
      filter,
      excludeAssociatedTokens: display.excludeAssociatedTokens,
      excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
    },
  )

  const timeRange = getChartTimeRangeFromData(
    data?.chart.map(([timestamp]) => ({
      timestamp,
    })),
  )
  const stats = getStats(data?.chart)

  const byBridgeTypeChart = (
    <L2BridgeTypeTvsChart
      unit={unit}
      filter={filter}
      range={range}
      excludeAssociatedTokens={display.excludeAssociatedTokens}
      excludeRwaRestrictedTokens={display.excludeRwaRestrictedTokens}
      milestones={milestones}
    />
  )

  const byAssetSourceChart = (
    <L2AssetCategoryTvsChart
      unit={unit}
      filter={filter}
      range={range}
      excludeAssociatedTokens={display.excludeAssociatedTokens}
      excludeRwaRestrictedTokens={display.excludeRwaRestrictedTokens}
      milestones={milestones}
    />
  )

  return (
    <ChartShowsPreviousData value={isPlaceholderData}>
      <div>
        <TvsChartHeader
          unit={unit}
          value={stats?.total}
          change={stats?.change}
          range={shownInput.range}
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
          <div className="flex flex-wrap items-center gap-2">
            <TvsChartUnitControls unit={unit} setUnit={setUnit} />
            <CompareProjectsLink href={getCompareEntryUrl({ metric: 'tvs' })} />
          </div>
          <TvsChartRangeControls range={range} setRange={setRange} />
        </ChartControlsWrapper>
      </div>
    </ChartShowsPreviousData>
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
