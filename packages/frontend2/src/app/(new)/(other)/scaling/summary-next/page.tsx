import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES, layer2s, layer3s } from '@l2beat/config'
import { About } from '~/app/_components/about'
import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { OtherSites } from '~/app/_components/other-sites'
import { HydrateClient, api } from '~/trpc/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'
import { getCookie } from '~/utils/cookies/server'
import { getCommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
  robots: {
    index: false,
  },
})

export default async function Page() {
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()
  const projects = [...layer2s, ...layer3s].map((project) =>
    getCommonScalingEntry({
      project,
      hasImplementationChanged:
        !!implementationChangeReport.projects[project.id.toString()],
      isVerified: !!projectsVerificationStatuses[project.id.toString()],
    }),
  )

  await api.scaling.summary.prefetch({
    type: 'layer2',
    range: getCookie('chartRange'),
  })

  return (
    <HydrateClient>
      <div className="mb-20">
        <ScalingFilterContextProvider>
          <TvlChart milestones={HOMEPAGE_MILESTONES} />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingSummaryTables {...{ projects }} />
        </ScalingFilterContextProvider>
        <OtherSites />
        <About />
      </div>
    </HydrateClient>
  )
}
