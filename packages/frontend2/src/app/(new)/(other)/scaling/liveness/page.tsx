import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getScalingLivenessEntries } from '~/server/features/scaling/get-scaling-liveness-entries'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingLivenessTable } from './_components/table/scaling-liveness-table'
import { LivenessWarning } from './_components/liveness-warning'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/liveness',
  },
})

export default async function Page() {
  const entries = await getScalingLivenessEntries()

  return (
    <ScalingFilterContextProvider>
      <div>
        <SimplePageHeader>Liveness</SimplePageHeader>
        <LivenessWarning />
      </div>
      <ScalingLivenessTable entries={entries} />
    </ScalingFilterContextProvider>
  )
}
