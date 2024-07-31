import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getScalingLivenessEntries } from '~/server/features/scaling/get-scaling-liveness-entries'
import { getLiveness } from '~/server/features/scaling/liveness/get-liveness'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getProjectsVerificationStatuses } from '~/server/features/verification-status/get-projects-verification-statuses'
import { getDefaultMetadata } from '~/utils/get-default-metadata'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/liveness',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'all' })
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()
  const liveness = await getLiveness()
  const entries = await getScalingLivenessEntries({
    tvl,
    liveness,
    projectsVerificationStatuses,
    implementationChangeReport,
  })

  return (
    <div className="space-y-8">
      <div>
        <SimplePageHeader>Liveness</SimplePageHeader>
        <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center text-xs font-medium text-black">
          Please note, the values on the page{' '}
          <span className="font-extrabold">do not</span> reflect the time to
          finality (the time it would take for your L2 transaction to be
          finalized on the L1 after it has been submitted).
        </p>
      </div>
      <pre>{JSON.stringify(entries, null, 2)}</pre>
      {/*<BasicTable
        table={table}
        onResetFilters={() => setFilters(DEFAULT_DA_SCALING_FILTERS)}
      />*/}
    </div>
  )
}
