import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ScalingBridgingTypeTvsChart } from '~/components/chart/tvs/stacked/ScalingBridgingTypeTvsChart'
import { ScalingTokenCategoryTvsChart } from '~/components/chart/tvs/stacked/ScalingTokenCategoryTvsChart'
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

  const { data } = api.tvs.chart.useQuery({
    range: { type: timeRange },
    excludeAssociatedTokens,
    filter,
  })

  const chartRange = getChartRange(
    data?.chart.map(([timestamp]) => ({
      timestamp,
    })),
  )
  const stats = getStats(data?.chart)

  return (
    <div>
      <TvsChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={timeRange}
        timeRange={chartRange}
      />
      <div className="grid grid-cols-2 gap-x-6">
        <ScalingBridgingTypeTvsChart
          unit={unit}
          filter={filter}
          range={timeRange}
          excludeAssociatedTokens={excludeAssociatedTokens}
          milestones={milestones}
        />
        <ScalingTokenCategoryTvsChart
          tab={tab}
          entries={entries}
          milestones={milestones}
          range={timeRange}
          unit={unit}
        />
      </div>
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
    | [number, number | null, number | null, number | null, number | null][]
    | undefined,
) {
  const pointsWithData = data?.filter(
    ([_, __, native, canonical, external]) =>
      native !== null && canonical !== null && external !== null,
  ) as [number, number, number, number, number | null][]

  const oldestDataPoint = pointsWithData?.at(0)
  const newestDataPoint = pointsWithData?.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const total = newestDataPoint[1] + newestDataPoint[2] + newestDataPoint[3]
  const oldestTotal =
    oldestDataPoint[1] + oldestDataPoint[2] + oldestDataPoint[3]
  const change = (oldestTotal === 0 ? 0 : total / oldestTotal) - 1

  return {
    total,
    change,
  }
}
