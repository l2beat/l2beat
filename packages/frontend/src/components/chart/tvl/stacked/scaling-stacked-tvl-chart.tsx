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
import { TvlChartUnitControls } from '~/components/chart/tvl/tvl-chart-unit-controls'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TvlProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
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

  const { columns, chartRange, valuesStyle, change, total } =
    useStackedTvlChartRenderParams({
      milestones,
      unit,
      data,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={(value: number) => formatCurrency(value, unit)}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <StackedTvlChartHover {...data} unit={unit} />
      )}
    >
      <section className="flex flex-col gap-4">
        <TvlChartHeader
          unit={unit}
          value={total?.[unit]}
          change={change}
          range={timeRange}
          timeRange={chartRange}
        />
        <Chart />
        <ChartControlsWrapper>
          <TvlChartUnitControls unit={unit} setUnit={setUnit} />
          <TvlChartTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
      </section>
    </ChartProvider>
  )
}
