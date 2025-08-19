import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useScalingTvsChartControlsContext } from '~/components/projects/sections/scaling-tvs/ScalingTvsControlsContext'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { api } from '~/trpc/React'
import { TokenChart } from './TokenChart'

interface Props {
  projectId: string
  milestones: Milestone[]
  token: ProjectToken
}

export function ProjectTokenChart2({ projectId, milestones, token }: Props) {
  const { range } = useScalingTvsChartControlsContext()

  const { data, isLoading } = api.tvs.tokenChart.useQuery({
    token: {
      tokenId: token.id,
      projectId,
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
      isLoading={isLoading}
      milestones={milestones}
      token={token}
      syncedUntil={data?.syncedUntil}
      className="mt-4 mb-3"
    />
  )
}
