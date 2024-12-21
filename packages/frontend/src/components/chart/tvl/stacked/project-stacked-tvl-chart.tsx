'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { TvlChartUnitControls } from '~/components/chart/tvl/tvl-chart-unit-controls'
import { TokenCombobox } from '~/components/token-combobox'
import { featureFlags } from '~/consts/feature-flags'
import {
  type ProjectToken,
  type ProjectTokens,
} from '~/server/features/scaling/tvl/tokens/get-tokens-for-project'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import { ProjectChartTimeRange } from '../../core/chart-time-range'
import { type ChartUnit } from '../../types'
import { ProjectTokenChart } from '../token/project-token-chart'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { StackedTvlChartHover } from './stacked-tvl-chart-hover'
import { StackedTvlChartLegend } from './stacked-tvl-chart-legend'
import { useStackedTvlChartRenderParams } from './use-stacked-tvl-chart-render-params'

interface Props {
  milestones: Milestone[]
  projectId: string
  tokens: ProjectTokens | undefined
  isBridge: boolean
}

export function ProjectStackedTvlChart({
  milestones,
  projectId,
  tokens,
  isBridge,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [timeRange, setTimeRange] = useState<TvlChartRange>('30d')
  const [unit, setUnit] = useState<ChartUnit>('usd')

  if (tokens && token) {
    return (
      <ProjectTokenChart
        isBridge={isBridge}
        tokens={tokens}
        setToken={setToken}
        token={token}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        unit={unit}
        setUnit={setUnit}
        milestones={milestones}
        projectId={projectId}
        showStackedChartLegend
      />
    )
  }

  return (
    <DefaultChart
      isBridge={isBridge}
      projectId={projectId}
      milestones={milestones}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      tokens={tokens}
      token={token}
      setToken={setToken}
      unit={unit}
      setUnit={setUnit}
    />
  )
}

interface DefaultChartProps {
  projectId: string
  isBridge: boolean
  milestones: Milestone[]
  timeRange: TvlChartRange
  setTimeRange: (timeRange: TvlChartRange) => void
  tokens: ProjectTokens | undefined
  token: ProjectToken | undefined
  setToken: (token: ProjectToken | undefined) => void
  unit: ChartUnit
  setUnit: (unit: ChartUnit) => void
}

function DefaultChart({
  projectId,
  isBridge,
  milestones,
  timeRange,
  setTimeRange,
  tokens,
  token,
  setToken,
  unit,
  setUnit,
}: DefaultChartProps) {
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
      formatYAxisLabel={(value: number) => formatCurrency(value, unit)}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <StackedTvlChartHover {...data} unit={unit} />
      )}
    >
      <section className="flex flex-col">
        <ChartControlsWrapper>
          <ProjectChartTimeRange range={chartRange} />
          <TvlChartTimeRangeControls
            projectSection
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
        <Chart className="mt-4" />
        {featureFlags.showOthers && <StackedTvlChartLegend className="my-2" />}
        <TvlChartUnitControls unit={unit} setUnit={setUnit}>
          {tokens && (
            <TokenCombobox
              tokens={tokens}
              value={token}
              setValue={setToken}
              isBridge={isBridge}
            />
          )}
        </TvlChartUnitControls>
      </section>
    </ChartProvider>
  )
}
