import type { ProjectTvsInfo } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { useLayer2sRwaRestrictedTokensContext } from '~/pages/layer2s/components/Layer2sRwaRestrictedTokensContext'
import { TvsBreakdownSummaryBox } from '~/pages/layer2s/project/tvs-breakdown/components/TvsBreakdownSummaryBox'
import { useTRPC } from '~/trpc/React'
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
  const trpc = useTRPC()
  const { range } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useLayer2sRwaRestrictedTokensContext()
  const { data, isLoading, refetch } = useQuery(
    trpc.tvs.table.queryOptions({
      type: 'projects',
      projectIds: [projectId],
      excludeRwaRestrictedTokens,
    }),
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to invalidate on range change, to have chart and stats in sync
  useEffect(() => {
    refetch()
  }, [range])

  const projectData = data?.projects?.[projectId]

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
