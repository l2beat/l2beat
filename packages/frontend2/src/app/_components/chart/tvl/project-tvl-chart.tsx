'use client'
import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { TvlChartHover } from './tvl-chart-hover'
import { TvlChartTimeRangeControls } from './tvl-chart-time-range-controls'
import { TvlChartUnitAndScaleControls } from './tvl-chart-unit-and-scale-controls'
import { useTvlChartRenderParams } from './use-tvl-chart-render-params'

interface Props {
  projectId: string
  milestones: Milestone[]
}

export function ProjectTvlChart({ projectId, milestones }: Props) {
  const [scale, setScale] = useState('lin')
  const [unit, setUnit] = useState<'usd' | 'eth'>('usd')

  const [timeRange, setTimeRange] = useState<TvlChartRange>('7d')

  const { data } = api.tvl.chart.useQuery({
    range: timeRange,
    filter: { type: 'projects', projectIds: [projectId] },
  })

  const { chartRange, formatYAxisLabel, valuesStyle, columns } =
    useTvlChartRenderParams({ milestones, unit, data })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={chartRange}
      useLogScale={scale === 'log'}
      renderHoverContents={(data) => <TvlChartHover data={data} />}
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
