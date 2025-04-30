import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingDaPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/data-availability',
  },
})

export default async function Page() {
  const entries = await getScalingDaEntries()

  return <ScalingDaPage entries={entries} />
}
