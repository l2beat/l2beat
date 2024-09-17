'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/(other)/_components/scaling-associated-tokens-context'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/(other)/_components/scaling-filter-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { TvlChartUnitControls } from '~/components/chart/tvl/tvl-chart-unit-and-scale-controls'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TvlProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { type ChartUnit } from '../../types'
import { TvlChartHeader } from '../tvl-chart-header'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { StackedTvlChartHover } from './stacked-tvl-chart-hover'
import { useStackedTvlChartRenderParams } from './use-stacked-tvl-chart-render-params'

interface Props {
  milestones: Milestone[]
  entries: ScalingTvlEntry[]
}

export function ScalingStackedTvlChart({ milestones, entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useCookieState('scalingTvlChartRange')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvl-unit', 'usd')

  const filter = useMemo<TvlProjectFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'layer2' }
    }

    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, filters, includeFilter])

  const { data, isLoading } = api.tvl.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
  })

  const { columns, chartRange, valuesStyle, change } =
    useStackedTvlChartRenderParams({
      milestones,
      unit,
      data: data?.chart,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={(value: number) =>
        formatCurrency(value, unit, { showLessThanMinimum: false })
      }
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <StackedTvlChartHover {...data} unit={unit} />
      )}
    >
      <section className="flex flex-col gap-4">
        <TvlChartHeader
          unit={unit}
          value={data?.total[unit]}
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
