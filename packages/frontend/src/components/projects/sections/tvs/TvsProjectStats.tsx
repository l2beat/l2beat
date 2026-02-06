import type { ProjectTvsInfo } from '@l2beat/config'
import { useEffect } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import { TvsBreakdownSummaryBox } from '~/pages/scaling/project/tvs-breakdown/components/TvsBreakdownSummaryBox'
import { api } from '~/trpc/React'
import { TvsBreakdownButton } from './TvsBreakdownButton'

export function TvsProjectStats({
  tvsBreakdownUrl,
  tvsInfo,
  projectId,
}: {
  tvsBreakdownUrl?: string
  tvsInfo: ProjectTvsInfo | undefined
  projectId: string
}) {
  const { range } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { data, isLoading, refetch } = api.tvs.table.useQuery({
    type: 'projects',
    projectIds: [projectId],
    excludeRwaRestrictedTokens,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to invalidate on range change, to have chart and stats in sync
  useEffect(() => {
    refetch()
  }, [range])

  const projectData = data?.projects[projectId]

  return (
    <>
      <HorizontalSeparator className="my-4" />
      <TvsBreakdownSummaryBox
        tvsData={projectData}
        isLoading={isLoading}
        warning={tvsInfo?.warnings[0]}
      />
      {tvsBreakdownUrl && (
        <div className="mt-3 w-full md:hidden">
          <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
        </div>
      )}
    </>
  )
}
