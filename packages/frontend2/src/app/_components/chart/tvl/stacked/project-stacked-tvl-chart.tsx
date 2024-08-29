'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { TvlChartUnitAndScaleControls } from '~/app/_components/chart/tvl/tvl-chart-unit-and-scale-controls'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { StackedTvlChartHover } from './stacked-tvl-chart-hover'
import { useStackedTvlChartRenderParams } from './use-stacked-tvl-chart-render-params'

interface Props {
  milestones: Milestone[]
  projectId: string
}

export function ProjectStackedTvlChart({ milestones, projectId }: Props) {
  const [timeRange, setTimeRange] = useState<TvlChartRange>('7d')

  const [unit, setUnit] = useLocalStorage<'usd' | 'eth'>(
    'scaling-tvl-unit',
    'usd',
  )
  const [scale, setScale] = useState('lin')

  const { data, isLoading } = api.tvl.chart.useQuery({
    filter: { type: 'projects', projectIds: [projectId] },
    range: timeRange,
    excludeAssociatedTokens: false,
  })

  const { columns, chartRange, valuesStyle } = useStackedTvlChartRenderParams({
    milestones,
    unit,
    data,
  })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={(value: number) =>
        formatCurrency(value, unit, { showLessThanMinimum: false })
      }
      range={chartRange}
      useLogScale={scale === 'log'}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <StackedTvlChartHover {...data} currency={unit} />
      )}
    >
      <section className="flex flex-col gap-4">
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
