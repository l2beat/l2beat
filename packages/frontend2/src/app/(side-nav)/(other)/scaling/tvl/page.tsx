import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingStackedTvlChart } from '~/components/chart/tvl/stacked/scaling-stacked-tvl-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { get7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingTvlTable } from './_components/scaling-tvl-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvl',
  },
})

export default async function Page() {
  const [implementationChangeReport, projectsVerificationStatuses, tvl] =
    await Promise.all([
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
      get7dTvlBreakdown(),
      api.tvl.chart.prefetch({
        filter: { type: 'layer2' },
        range: getCookie('scalingTvlChartRange'),
        excludeAssociatedTokens: false,
      }),
    ])

  const entries = getScalingTvlEntries({
    implementationChangeReport,
    projectsVerificationStatuses,
    tvl,
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <ScalingStackedTvlChart
            milestones={HOMEPAGE_MILESTONES}
            entries={entries}
          />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingTvlTable entries={entries} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
