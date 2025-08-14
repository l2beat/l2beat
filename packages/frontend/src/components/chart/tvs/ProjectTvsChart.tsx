import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { TokenCombobox } from '../../TokenCombobox'
import type { ChartUnit } from '../types'
import { ProjectTokenChart } from './ProjectTokenChart'
import type { TvsChartDataPoint } from './TvsChart'
import { TvsChart } from './TvsChart'
import { TvsChartTimeRangeControls } from './TvsChartTimeRangeControls'
import { TvsChartUnitControls } from './TvsChartUnitControls'

interface Props {
  projectId: string
  milestones: Milestone[]
  tokens: ProjectTokens | undefined
  defaultRange: TvsChartRange
}

export function ProjectTvsChart({
  projectId,
  milestones,
  tokens,
  defaultRange,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [unit, setUnit] = useState<ChartUnit>('usd')

  const [timeRange, setTimeRange] = useState<TvsChartRange>(defaultRange)

  if (tokens && token) {
    return (
      <ProjectTokenChart
        isBridge={true}
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
  timeRange,
  setTimeRange,
  unit,
  setUnit,
  tokens,
  setToken,
  token,
}: DefaultChartProps) {
  const { data, isLoading } = api.tvs.chart.useQuery({
    range: { type: timeRange },
    filter: { type: 'projects', projectIds: [projectId] },
    excludeAssociatedTokens: false,
  })

  const chartData: TvsChartDataPoint[] | undefined = data?.chart.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total =
        native !== null && canonical !== null && external !== null
          ? native + canonical + external
          : null
      const divider = unit === 'usd' ? 1 : ethPrice
      return {
        timestamp,
        value:
          total !== null && divider !== null && divider !== 0
            ? total / divider
            : null,
      }
    },
  )

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div className="flex flex-col gap-4">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <TvsChartTimeRangeControls
          projectSection
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
      <TvsChart
        data={chartData}
        unit={unit}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        milestones={milestones}
        tickCount={4}
      />
      <TvsChartUnitControls unit={unit} setUnit={setUnit}>
        {tokens && (
          <TokenCombobox
            tokens={tokens}
            setValue={setToken}
            value={token}
            isBridge={true}
          />
        )}
      </TvsChartUnitControls>
    </div>
  )
}
