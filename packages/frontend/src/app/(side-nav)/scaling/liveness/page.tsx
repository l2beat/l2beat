import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
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
        <MainPageHeader>Liveness</MainPageHeader>
        <LivenessWarning />
        <MainPageCard>
          <ScalingLivenessTable entries={entries} />
        </MainPageCard>
      </LivenessTimeRangeContextProvider>
    </ScalingFilterContextProvider>
  )
}
