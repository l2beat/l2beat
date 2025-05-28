import { getBridgesArchivedEntries } from 'rewrite/src/server/features/bridges/get-bridges-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesArchivedPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/archived',
  },
})

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return <BridgesArchivedPage entries={entries} />
}
