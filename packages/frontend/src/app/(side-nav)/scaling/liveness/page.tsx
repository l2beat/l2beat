import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { LivenessHeader } from './_components/liveness-header'
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
        <LivenessHeader />
        <ScalingFilterContextProvider>
          <ScalingLivenessTables {...entries} />
        </ScalingFilterContextProvider>
      </LivenessTimeRangeContextProvider>
    </>
  )
}
