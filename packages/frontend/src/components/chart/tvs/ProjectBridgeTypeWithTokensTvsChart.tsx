import type { Milestone } from '@l2beat/config'
import { useState } from 'react'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import type { ChartUnit } from '../types'
import { ProjectTokenChart } from './ProjectTokenChart'
import { ProjectBridgeTypeTvsChart } from './stacked/ProjectBridgeTypeTvsChart'

interface Props {
  milestones: Milestone[]
  projectId: string
  tokens: ProjectToken[] | undefined
  tvsBreakdownUrl?: string
  defaultRange: TvsChartRange
}

export function ProjectBridgeTypeWithTokensTvsChart({
  milestones,
  projectId,
  tokens,
  tvsBreakdownUrl,
  defaultRange,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [timeRange, setTimeRange] = useState<TvsChartRange>(defaultRange)
  const [unit, setUnit] = useState<ChartUnit>('usd')

  if (tokens && token) {
    return (
      <ProjectTokenChart
        isBridge={false}
        tokens={tokens}
        setToken={setToken}
        token={token}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        unit={unit}
        setUnit={setUnit}
        milestones={milestones}
        projectId={projectId}
        tvsBreakdownUrl={tvsBreakdownUrl}
        showStackedChartLegend
      />
    )
  }

  return (
    <ProjectBridgeTypeTvsChart
      projectId={projectId}
      milestones={milestones}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      tokens={tokens}
      token={token}
      setToken={setToken}
      unit={unit}
      setUnit={setUnit}
      tvsBreakdownUrl={tvsBreakdownUrl}
    />
  )
}
