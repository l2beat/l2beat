import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { ProjectTokenChart } from '~/components/chart/tvs/token/ProjectTokenChart'
import { useSelectedTokenContext } from '~/components/chart/tvs/token/SelectedTokenContext'
import { TokenSummaryBox } from '~/components/chart/tvs/token/TokenSummaryBox'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type { ProjectToken } from '~/server/features/layer2s/tvs/tokens/getTokensForProject'
import { useTRPC } from '~/trpc/React'

export function TokenChart({
  project,
  milestones,
}: {
  project: ChartProject
  milestones: Milestone[]
}) {
  const { selectedToken } = useSelectedTokenContext()
  if (!selectedToken) {
    return null
  }

  // A chart per token: another token's chart, kept while this one loads,
  // would show under this token's name.
  return (
    <>
      <TokenChartControls
        key={selectedToken.id}
        token={selectedToken}
        projectId={project.id}
        className="mt-2"
      />
      <ProjectTokenChart
        key={selectedToken.id}
        project={project}
        milestones={milestones}
        token={selectedToken}
      />
      <TokenSummaryBox token={selectedToken} />
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
  const trpc = useTRPC()
  const { range, setRange } = useTvsChartControlsContext()
  const { data, isPlaceholderData } = useChartQuery(trpc.tvs.tokenChart, {
    token: {
      tokenId: token.id,
      projectId,
    },
    range,
  })

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [data?.chart],
  )

  return (
    <ChartShowsPreviousData value={isPlaceholderData}>
      <TvsChartControls
        className={className}
        timeRange={timeRange}
        range={{
          value: range,
          setValue: setRange,
        }}
      />
    </ChartShowsPreviousData>
  )
}
