import type { ProjectTvsInfo } from '@l2beat/config'
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
  tvsInfo: ProjectTvsInfo
  projectId: string
}) {
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { data, isLoading } = api.tvs.table.useQuery({
    type: 'projects',
    projectIds: [projectId],
    includeRwaRestrictedTokens,
  })

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
