import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { ProjectTokenChart } from '~/components/chart/tvs/token/ProjectTokenChart'
import { TokenSummaryBox } from '~/components/chart/tvs/token/TokenSummaryBox'
import type { ChartProject } from '~/components/core/chart/Chart'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { api } from '~/trpc/React'

export function TokenChart({
  token,
  project,
  milestones,
}: {
  token: ProjectToken | undefined
  project: ChartProject
  milestones: Milestone[]
}) {
  if (!token) {
    return null
  }
  return (
    <>
      <TokenChartControls
        token={token}
        projectId={project.id}
        className="mt-2"
      />
      <ProjectTokenChart
        project={project}
        milestones={milestones}
        token={token}
      />
      <TokenSummaryBox token={token} />
    </>
  )
}

function TokenChartControls({
  token,
  projectId,
  className,
}: {
  token: ProjectToken
  projectId: string
  className?: string
}) {
  const { range, setRange } = useTvsChartControlsContext()
  const { data } = api.tvs.tokenChart.useQuery({
    token: {
      tokenId: token.id,
      projectId,
    },
    range,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.chart.map(([timestamp]) => ({ timestamp }))),
    [data?.chart],
  )

  return (
    <TvsChartControls
      className={className}
      chartRange={chartRange}
      range={{
        value: range,
        setValue: setRange,
      }}
    />
  )
}
