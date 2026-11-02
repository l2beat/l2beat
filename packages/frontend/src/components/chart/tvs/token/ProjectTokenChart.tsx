import type { Milestone } from '@l2beat/config'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import type { ProjectToken } from '~/server/features/layer2s/tvs/tokens/getTokensForProject'
import { useTRPC } from '~/trpc/React'
import { TokenChart } from './TokenChart'

interface Props {
  project: ChartProject
  milestones: Milestone[]
  token: ProjectToken
}

export function ProjectTokenChart({ project, milestones, token }: Props) {
  const trpc = useTRPC()
  const { range } = useTvsChartControlsContext()

  const { data, isLoading, isPlaceholderData } = useQuery(
    trpc.tvs.tokenChart.queryOptions(
      {
        token: {
          tokenId: token.id,
          projectId: project.id,
        },
        range,
      },
      { placeholderData: keepPreviousData },
    ),
  )

  const chartData = useMemo(() => {
    return data?.chart.map(([timestamp, usdValue]) => ({
      timestamp,
      value: usdValue,
    }))
  }, [data])

  return (
    <ChartShowsPreviousData value={isPlaceholderData}>
      <div className="mt-4 mb-3">
        <TokenChart
          data={chartData}
          project={project}
          isLoading={isLoading}
          milestones={milestones}
          token={token}
          syncedUntil={data?.syncedUntil}
        />
      </div>
    </ChartShowsPreviousData>
  )
}
