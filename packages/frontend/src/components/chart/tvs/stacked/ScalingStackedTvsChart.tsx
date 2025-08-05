import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import { Checkbox } from '~/components/core/Checkbox'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useScalingAssociatedTokensContext } from '~/pages/scaling/components/ScalingAssociatedTokensContext'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../../core/chart/ChartControlsWrapper'
import { getChartRange } from '../../../core/chart/utils/getChartRangeFromColumns'
import type { ChartUnit } from '../../types'
import { TvsChartHeader } from '../TvsChartHeader'
import { TvsChartTimeRangeControls } from '../TvsChartTimeRangeControls'
import { StackedTvsChart } from './StackedTvsChart'

interface Props {
  milestones: Milestone[]
  entries: ScalingTvsEntry[]
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export function ScalingStackedTvsChart({ milestones, entries, tab }: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  const { state: filters } = useTableFilterContext()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvs-unit', 'usd')

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

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: { type: timeRange },
    excludeAssociatedTokens,
    filter,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, native, canonical, external, ethPrice]) => {
        const divider = unit === 'usd' ? 1 : ethPrice
        return {
          timestamp,
          native:
            native !== null && divider !== null && divider !== 0
              ? native / divider
              : null,
          canonical:
            canonical !== null && divider !== null && divider !== 0
              ? canonical / divider
              : null,
          external:
            external !== null && divider !== null && divider !== 0
              ? external / divider
              : null,
        }
      }),
    [data, unit],
  )
  const chartRange = getChartRange(chartData)
  const stats = getStats(chartData)

  return (
    <div>
      <TvsChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={timeRange}
        timeRange={chartRange}
      />
      <StackedTvsChart
        className="mt-4 mb-2"
        data={chartData}
        milestones={milestones}
        unit={unit}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
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
    | {
        timestamp: number
        native: number | null
        canonical: number | null
        external: number | null
      }[]
    | undefined,
) {
  const pointsWithData = data?.filter(
    (point) =>
      point.native !== null &&
      point.canonical !== null &&
      point.external !== null,
  ) as {
    timestamp: number
    native: number
    canonical: number
    external: number
  }[]
  const oldestDataPoint = pointsWithData?.at(0)
  const newestDataPoint = pointsWithData?.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const total =
    newestDataPoint.native +
    newestDataPoint.canonical +
    newestDataPoint.external
  const oldestTotal =
    oldestDataPoint.native +
    oldestDataPoint.canonical +
    oldestDataPoint.external
  const change = total / oldestTotal - 1

  return {
    total,
    change,
  }
}
