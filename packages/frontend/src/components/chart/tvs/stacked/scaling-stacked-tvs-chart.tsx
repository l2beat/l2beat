'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import { useScalingFilterValues } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { TvsChartUnitControls } from '~/components/chart/tvs/tvs-chart-unit-controls'
import { Checkbox } from '~/components/core/checkbox'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'

import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/project-filter-utils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { ChartControlsWrapper } from '../../../core/chart/chart-controls-wrapper'
import { getChartRange } from '../../../core/chart/utils/get-chart-range-from-columns'
import type { ChartUnit } from '../../types'
import { TvsChartHeader } from '../tvs-chart-header'
import { TvsChartTimeRangeControls } from '../tvs-chart-time-range-controls'
import { StackedTvsChart } from './stacked-tvs-chart'
interface Props {
  milestones: Milestone[]
  entries: ScalingTvsEntry[]
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export function ScalingStackedTvsChart({ milestones, entries, tab }: Props) {
  const { checked } = useRecategorisationPreviewContext()
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvs-unit', 'usd')

  const filter = useMemo<TvsProjectFilter>(() => {
    if (filters.isEmpty) {
      return {
        type: tab,
      }
    }
    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries, filters.isEmpty, tab])

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
    previewRecategorisation: checked,
  })

  const chartData = useMemo(
    () =>
      data?.map(([timestamp, native, canonical, external, ethPrice]) => {
        const divider = unit === 'usd' ? 100 : ethPrice
        return {
          timestamp,
          native: native / divider,
          canonical: canonical / divider,
          external: external / divider,
        }
      }),
    [data, unit],
  )

  const chartRange = getChartRange(chartData)
  const stats = getStats(chartData)

  return (
    <section>
      <TvsChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={timeRange}
        timeRange={chartRange}
      />
      <StackedTvsChart
        className="mb-2 mt-4"
        data={chartData}
        milestones={milestones}
        unit={unit}
        isLoading={isLoading}
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
    </section>
  )
}

function getStats(
  data:
    | {
        timestamp: number
        native: number
        canonical: number
        external: number
      }[]
    | undefined,
) {
  const oldestDataPoint = data?.at(0)
  const newestDataPoint = data?.at(-1)
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
