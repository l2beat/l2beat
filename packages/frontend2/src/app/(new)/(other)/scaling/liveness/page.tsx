import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getScalingLivenessEntries } from '~/server/features/scaling/get-scaling-liveness-entries'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { LivenessTimeRangeContextProvider } from './_components/liveness-time-range-context'
import { LivenessWarning } from './_components/liveness-warning'
import { ScalingLivenessTable } from './_components/table/scaling-liveness-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/liveness',
  },
})

export default async function Page() {
  const entries = await getScalingLivenessEntries()

  return (
    <ScalingFilterContextProvider>
      <LivenessTimeRangeContextProvider>
        <div>
          <SimplePageHeader>Liveness</SimplePageHeader>
          <LivenessWarning />
        </div>
        <ScalingLivenessTable entries={entries} />
      </LivenessTimeRangeContextProvider>
    </ScalingFilterContextProvider>
  )
}
