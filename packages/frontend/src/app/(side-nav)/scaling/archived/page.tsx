import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingArchivedPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/archived',
  },
})

export default async function Page() {
  const entries = await getScalingArchivedEntries()
  return <ScalingArchivedPage entries={entries} />
}
