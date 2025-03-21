import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { getDefaultMetadata } from '~/utils/metadata'
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
        <TableFilterContextProvider>
          <ScalingLivenessTables {...entries} />
        </TableFilterContextProvider>
      </LivenessTimeRangeContextProvider>
    </>
  )
}
