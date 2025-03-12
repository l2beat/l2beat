import { MainPageHeader } from '~/components/main-page-header'
import { NewTableFilterContextProvider } from '~/components/table/filters/new-table-filter-context'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
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
      <NewTableFilterContextProvider>
        <ScalingArchivedTables {...entries} />
      </NewTableFilterContextProvider>
    </>
  )
}
