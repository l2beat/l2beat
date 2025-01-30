'use client'
import type { Milestone } from '@l2beat/config'
import { useState } from 'react'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { TokenCombobox } from '../../token-combobox'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { ProjectChartTimeRange } from '../core/chart-time-range'
import type { ChartUnit } from '../types'
import { ProjectTokenChart } from './token/project-token-chart'
import { TvsChartHover } from './tvs-chart-hover'
import { TvsChartTimeRangeControls } from './tvs-chart-time-range-controls'
import { TvsChartUnitControls } from './tvs-chart-unit-controls'
import { useTvsChartRenderParams } from './use-tvs-chart-render-params'

interface Props {
  projectId: string
  milestones: Milestone[]
  tokens: ProjectTokens | undefined
  isBridge: boolean
}

export function ProjectTvsChart({
  projectId,
  milestones,
  tokens,
  isBridge,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [unit, setUnit] = useState<ChartUnit>('usd')

  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

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
  timeRange: TvsChartRange
  setTimeRange: (timeRange: TvsChartRange) => void
  tokens: ProjectTokens | undefined
  token: ProjectToken | undefined
  setToken: (token: ProjectToken | undefined) => void
  unit: ChartUnit
  setUnit: (unit: ChartUnit) => void
}

function DefaultChart({
  projectId,
  milestones,
  isBridge,
  timeRange,
  setTimeRange,
  unit,
  setUnit,
  tokens,
  setToken,
  token,
}: DefaultChartProps) {
  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    filter: { type: 'projects', projectIds: [projectId] },
    excludeAssociatedTokens: false,
  })

  const { chartRange, formatYAxisLabel, valuesStyle, columns } =
    useTvsChartRenderParams({ milestones, unit, data })
  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => <TvsChartHover data={data} />}
    >
      <section className="flex flex-col gap-4">
        <ChartControlsWrapper>
          <ProjectChartTimeRange range={chartRange} />
          <TvsChartTimeRangeControls
            projectSection
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
        <Chart />
        <TvsChartUnitControls unit={unit} setUnit={setUnit}>
          {tokens && (
            <TokenCombobox
              tokens={tokens}
              setValue={setToken}
              value={token}
              isBridge={isBridge}
            />
          )}
        </TvsChartUnitControls>
      </section>
    </ChartProvider>
  )
}
