'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { TvlChartUnitAndScaleControls } from '~/app/_components/chart/tvl/tvl-chart-unit-and-scale-controls'
import { TokenCombobox } from '~/app/_components/token-combobox'
import {
  type ProjectToken,
  type ProjectTokens,
} from '~/server/features/scaling/tvl/tokens/get-top-tokens-for-project'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { type ChartScale, type ChartUnit } from '../../types'
import { ProjectTokenChart } from '../token/project-token-chart'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { StackedTvlChartHover } from './stacked-tvl-chart-hover'
import { useStackedTvlChartRenderParams } from './use-stacked-tvl-chart-render-params'

interface Props {
  milestones: Milestone[]
  projectId: string
  tokens: ProjectTokens | undefined
}

export function ProjectStackedTvlChart({
  milestones,
  projectId,
  tokens,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [timeRange, setTimeRange] = useState<TvlChartRange>('7d')
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [scale, setScale] = useState<ChartScale>('lin')

  if (tokens && token) {
    return (
      <ProjectTokenChart
        tokens={tokens}
        setToken={setToken}
        token={token}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        unit={unit}
        setUnit={setUnit}
        scale={scale}
        setScale={setScale}
        milestones={milestones}
        projectId={projectId}
      />
    )
  }

  return (
    <StackedTvlChart
      projectId={projectId}
      milestones={milestones}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      tokens={tokens}
      token={token}
      setToken={setToken}
      unit={unit}
      setUnit={setUnit}
      scale={scale}
      setScale={setScale}
    />
  )
}

function StackedTvlChart({
  projectId,
  milestones,
  timeRange,
  setTimeRange,
  tokens,
  token,
  setToken,
  unit,
  setUnit,
  scale,
  setScale,
}: {
  projectId: string
  milestones: Milestone[]
  timeRange: TvlChartRange
  setTimeRange: (timeRange: TvlChartRange) => void
  tokens: ProjectTokens | undefined
  token: ProjectToken | undefined
  setToken: (token: ProjectToken | undefined) => void
  unit: ChartUnit
  setUnit: (unit: ChartUnit) => void
  scale: ChartScale
  setScale: (scale: ChartScale) => void
}) {
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
        <StackedTvlChartHover {...data} unit={unit} />
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
        {tokens && (
          <TokenCombobox tokens={tokens} value={token} setValue={setToken} />
        )}
      </section>
    </ChartProvider>
  )
}
