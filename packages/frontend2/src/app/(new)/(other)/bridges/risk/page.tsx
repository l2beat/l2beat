import { BridgesMvpWarning } from '~/app/_components/bridges-mvp-warning'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridge-risk-entries'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesRiskTables } from './_components/table/bridges-risks-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const [tvl, projectsVerificationStatuses, implementationChangeReport] =
    await Promise.all([
      getLatestTvlUsd({ type: 'bridge' }),
      getProjectsVerificationStatuses(),
      getImplementationChangeReport(),
    ])

  const entries = await getBridgeRiskEntries(
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  )

  return (
    <BridgesFilterContextProvider>
      <div className="mb-8">
        <SimplePageHeader>Risk Analysis</SimplePageHeader>
        <BridgesMvpWarning />
        <BridgesRiskTables entries={entries} />
      </div>
    </BridgesFilterContextProvider>
  )
}
