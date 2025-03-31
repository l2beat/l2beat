import { MainPageHeader } from '~/components/main-page-header'
import { FullGreenPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-green-pizza'
import { FullRedPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-red-pizza'
import { FullYellowPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-yellow-pizza'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { env } from '~/env'
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
      {env.NEXT_PUBLIC_L2BEATZZA && (
        <div className="size-0">
          <FullRedPizzaSymbol />
          <FullYellowPizzaSymbol />
          <FullGreenPizzaSymbol />
        </div>
      )}
      <MainPageHeader>Archived</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingArchivedTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
