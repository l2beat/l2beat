import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingStackedTvlChart } from '~/components/chart/tvl/stacked/scaling-stacked-tvl-chart'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { get7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingTvlTables } from './_components/scaling-tvl-tables'

export const revalidate = 600
export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvl',
  },
})

export default async function Page() {
  const [projectsChangeReport, projectsVerificationStatuses, tvl] =
    await Promise.all([
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
      get7dTvlBreakdown(),
      api.tvl.chart.prefetch({
        filter: { type: 'layer2' },
        range: '1y',
        excludeAssociatedTokens: false,
      }),
    ])

  const entries = getScalingTvlEntries({
    projectsChangeReport,
    projectsVerificationStatuses,
    tvl,
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <MainPageHeader>Value Locked</MainPageHeader>
          <MainPageCard>
            <ScalingStackedTvlChart
              milestones={HOMEPAGE_MILESTONES}
              entries={[
                ...entries.rollups,
                ...entries.validiumsAndOptimiums,
                ...(entries.others ?? []),
              ]}
            />
          </MainPageCard>
          <ScalingTvlTables {...entries} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
