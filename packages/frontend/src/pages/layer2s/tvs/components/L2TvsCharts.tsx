import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { L2AssetCategoryTvsChart } from '~/components/chart/tvs/stacked/L2AssetCategoryTvsChart'
import { L2BridgeTypeTvsChart } from '~/components/chart/tvs/stacked/L2BridgeTypeTvsChart'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { CompareProjectsLink } from '~/pages/layer2s/compare/components/CompareProjectsLink'
import { getCompareEntryUrl } from '~/pages/layer2s/compare/utils/getCompareEntryUrl'
import type { L2TvsEntry } from '~/server/features/layer2s/tvs/getL2TvsEntries'
import type { TvsProjectFilter } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
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
  const stats = getStats(data?.chart, unit)
  const shownRangeLabel = getRangeLabel(shownInput.range)

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
    <div>
      <ChartCardHeader
        title="Value secured"
        value={
          stats !== undefined ? formatCurrency(stats.total, unit) : undefined
        }
        change={shownRangeLabel !== undefined ? stats?.change : undefined}
        rangeLabel={shownRangeLabel}
        isLoading={data === undefined}
        isPlaceholderData={isPlaceholderData}
        meta={
          <ChartTimeRange
            timeRange={timeRange}
            isPlaceholderData={isPlaceholderData}
          />
        }
      />
      <div className="mt-4 mb-3 grid grid-cols-2 gap-x-6 max-lg:hidden">
        {byBridgeTypeChart}
        {byAssetSourceChart}
      </div>
      <ChartTabs
        className="-mx-4 md:-mx-6 pb-1! lg:hidden"
        charts={[byBridgeTypeChart, byAssetSourceChart]}
        labels={['By bridge type', 'By asset category']}
      />
      <ChartControlsWrapper>
        <div className="flex flex-wrap items-center gap-2">
          <TvsChartUnitControls unit={unit} setUnit={setUnit} />
          <CompareProjectsLink href={getCompareEntryUrl({ metric: 'tvs' })} />
        </div>
        <TvsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
    </div>
  )
}

/**
 * Written after the change, e.g. "30d". Max has no start to compare against,
 * so it has no label and the change is left out.
 */
function getRangeLabel(range: ChartRange) {
  const option = rangeToOption(range, TVS_RANGE_OPTIONS)
  if (option === 'max') return undefined
  if (option !== 'custom') return option
  const days = rangeToDays(range)
  return days === null ? undefined : `${days}d`
}

const TVS_RANGE_OPTIONS = ['7d', '30d', '90d', '180d', '1y'] as const

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
  unit: ChartUnit,
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

  if (unit === 'eth') {
    // The chart rows are in USD; the stacked charts divide by each row's
    // ETH price, so the headline does the same with the newest one.
    const ethPrice = newestDataPoint[1]
    if (!ethPrice) {
      return undefined
    }
    return { total: total / ethPrice, change }
  }

  return { total, change }
}
