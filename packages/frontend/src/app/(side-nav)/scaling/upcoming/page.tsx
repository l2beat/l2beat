import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingUpcomingTables } from './_components/scaling-upcoming-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/upcoming',
  },
})

export default async function Page() {
  const entries = await getScalingUpcomingEntries()
  return (
    <>
      <MainPageHeader>Upcoming</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingUpcomingTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
