'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(new)/(other)/_components/scaling-associated-tokens-context'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(new)/(other)/_components/scaling-filter-context'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { TvlChartUnitAndScaleControls } from '~/app/_components/chart/tvl/tvl-chart-unit-and-scale-controls'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TvlLayer2ProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { TvlChartHeader } from '../tvl-chart-header'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { StackedTvlChartHover } from './stacked-tvl-chart-hover'
import { useStackedTvlChartRenderParams } from './use-stacked-tvl-chart-render-params'

interface Props {
  milestones: Milestone[]
  entries: ScalingTvlEntry[]
}

export function StackedTvlChart({ milestones, entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useCookieState('scalingTvlChartRange')

  const [unit, setUnit] = useLocalStorage<'usd' | 'eth'>(
    'scaling-tvl-unit',
    'usd',
  )
  const [scale, setScale] = useLocalStorage('scaling-tvl-scale', 'lin')

  const chartDataType = useMemo<TvlLayer2ProjectFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'layer2' }
    }

    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, filters, includeFilter, excludeAssociatedTokens])

  const scalingSummaryQuery = api.scaling.summary.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    ...chartDataType,
  })

  const { data } = scalingSummaryQuery

  const { columns, chartRange, lastValue, change, valuesStyle } =
    useStackedTvlChartRenderParams({ milestones, unit, data })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={(value: number) =>
        formatCurrency(value, unit, { showLessThanMinimum: false })
      }
      range={chartRange}
      useLogScale={scale === 'log'}
      renderHoverContents={(data) => (
        <StackedTvlChartHover {...data} currency={unit} />
      )}
    >
      <section className="flex flex-col gap-4">
        <TvlChartHeader
          unit={unit}
          value={lastValue}
          change={change}
          range={timeRange}
        />
        <TvlChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />

        <Chart />
        <TvlChartUnitAndScaleControls
          unit={unit}
          scale={scale}
          setUnit={setUnit}
          setScale={setScale}
        />
      </section>
    </ChartProvider>
  )
}
