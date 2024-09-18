'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { type TvlProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { api } from '~/trpc/react'
import { type ChartUnit } from '../types'
import { TvlChartHeader } from './tvl-chart-header'
import { TvlChartHover } from './tvl-chart-hover'
import { TvlChartTimeRangeControls } from './tvl-chart-time-range-controls'
import { TvlChartUnitControls } from './tvl-chart-unit-and-scale-controls'
import { useTvlChartRenderParams } from './use-tvl-chart-render-params'

interface Props {
  entries: ScalingSummaryEntry[]
  milestones: Milestone[]
}

export function ScalingTvlChart({ entries, milestones }: Props) {
  const filters = useScalingFilterValues()
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const includeFilter = useScalingFilter()

  const [unit, setUnit] = useLocalStorage<ChartUnit>(
    `scaling-summary-unit`,
    'usd',
  )
  const [timeRange, setTimeRange] = useCookieState('scalingSummaryChartRange')

  const filter = useMemo<TvlProjectFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'layer2' }
    }

    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, includeFilter, filters])

  const { data: total } = api.tvl.total.useQuery({
    excludeAssociatedTokens,
    filter,
  })
  const { data, isLoading } = api.tvl.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
  })

  const { chartRange, formatYAxisLabel, valuesStyle, columns, change } =
    useTvlChartRenderParams({ milestones, unit, data })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => <TvlChartHover data={data} />}
    >
      <section className="flex flex-col gap-4">
        <TvlChartHeader
          unit={unit}
          value={total?.[unit]}
          change={change}
          range={timeRange}
        />
        <TvlChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />
        <Chart />
        <TvlChartUnitControls unit={unit} setUnit={setUnit} />
      </section>
    </ChartProvider>
  )
}
