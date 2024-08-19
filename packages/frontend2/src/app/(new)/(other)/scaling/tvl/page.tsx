import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { getDetailed7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-detailed-7d-tvl-breakdown'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingTvlTable } from './_components/scaling-tvl-table'
import { TvlChart } from './_components/tvl-chart'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvl',
  },
  robots: {
    index: false,
  },
})

export default async function Page() {
  const [implementationChangeReport, projectsVerificationStatuses, tvl] =
    await Promise.all([
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
      getDetailed7dTvlBreakdown(),
      api.scaling.summary.chart.prefetch({
        excludeAssociatedTokens: false,
        range: getCookie('scalingTvlChartRange'),
        type: 'layer2',
      }),
    ])

  const projects = getScalingTvlEntries({
    implementationChangeReport,
    projectsVerificationStatuses,
    tvl,
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <TvlChart milestones={HOMEPAGE_MILESTONES} entries={projects} />
        <HorizontalSeparator className="my-4 md:my-6" />
        <ScalingTvlTable projects={projects} />
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
