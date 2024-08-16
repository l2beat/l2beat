import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { getDetailed7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-detailed-7d-tvl-breakdown'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { HydrateClient, api } from '~/trpc/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { SummaryTvlChart } from './_components/scaling-tvl-chart'
import { ScalingTvlTable } from './_components/scaling-tvl-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
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
    ])

  const projects = getScalingTvlEntries({
    implementationChangeReport,
    projectsVerificationStatuses,
    tvl,
  })

  // TODO: prefetch chart data

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <SummaryTvlChart milestones={HOMEPAGE_MILESTONES} entries={projects} />
        <HorizontalSeparator className="my-4 md:my-6" />
        <ScalingTvlTable projects={projects} />
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
