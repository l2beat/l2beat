import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { api } from '~/trpc/React'
import { TokenChart } from './TokenChart'

interface Props {
  project: ChartProject
  milestones: Milestone[]
  token: ProjectToken
}

export function ProjectTokenChart({ project, milestones, token }: Props) {
  const { range } = useTvsChartControlsContext()

  const { data, isLoading } = api.tvs.tokenChart.useQuery({
    token: {
      tokenId: token.id,
      projectId: project.id,
    },
    range,
  })

  const chartData = useMemo(() => {
    return data?.chart.map(([timestamp, usdValue]) => ({
      timestamp,
      value: usdValue,
    }))
  }, [data])

  return (
    <TokenChart
      data={chartData}
      project={project}
      isLoading={isLoading}
      milestones={milestones}
      token={token}
      syncedUntil={data?.syncedUntil}
      className="mt-4 mb-3"
    />
  )
}
