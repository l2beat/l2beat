import { getScalingUpcomingEntries } from 'rewrite/src/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingUpcomingPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/upcoming',
  },
})

export default async function Page() {
  const entries = await getScalingUpcomingEntries()
  return <ScalingUpcomingPage entries={entries} />
}
