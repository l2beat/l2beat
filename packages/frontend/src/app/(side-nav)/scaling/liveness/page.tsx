import { MainPageHeader } from '~/components/main-page-header'
import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { LivenessDescription } from './_components/liveness-description'
import { LivenessTimeRangeContextProvider } from './_components/liveness-time-range-context'
import { ScalingLivenessTables } from './_components/scaling-liveness-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/liveness',
  },
})

export default async function Page() {
  const entries = await getScalingLivenessEntries()

  return (
    <>
      <LivenessTimeRangeContextProvider>
        <MainPageHeader>Liveness</MainPageHeader>
        <LivenessDescription />
        <ScalingFilterContextProvider>
          <ScalingLivenessTables {...entries} />
        </ScalingFilterContextProvider>
      </LivenessTimeRangeContextProvider>
    </>
  )
}
