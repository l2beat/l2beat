import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridge-summary-entries'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getTvl } from '~/server/features/scaling/get-tvl'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesSummaryTables } from './_components/table/bridges-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const [tvl, projectsVerificationStatuses, implementationChangeReport] =
    await Promise.all([
      getTvl(),
      getProjectsVerificationStatuses(),
      getImplementationChangeReport(),
    ])

  const entries = await getBridgesSummaryEntries(
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  )
  return (
    <div className="mb-8">
      <BridgesFilterContextProvider>
        <BridgesMvpWarning />
        <TvlChart data={tvl.bridges} milestones={[]} headerContent="bridges" />
        <HorizontalSeparator className="my-4 md:my-6" />
        <BridgesSummaryTables entries={entries} />
      </BridgesFilterContextProvider>
    </div>
  )
}
