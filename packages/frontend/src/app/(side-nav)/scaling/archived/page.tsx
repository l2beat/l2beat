import { MainPageHeader } from '~/components/main-page-header'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingArchivedTables } from './_components/scaling-archived-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/archived',
  },
})

export default async function Page() {
  const entries = await getScalingArchivedEntries()
  return (
    <>
      <MainPageHeader>Archived</MainPageHeader>
      <ScalingFilterContextProvider>
        <ScalingArchivedTables {...entries} />
      </ScalingFilterContextProvider>
    </>
  )
}
