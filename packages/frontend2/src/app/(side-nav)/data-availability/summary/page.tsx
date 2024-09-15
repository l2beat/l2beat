import { SimplePageHeader } from '~/components/simple-page-header'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { DaFilterContextProvider } from '../_components/filters/da-filter-context'
import { DaSummaryTable } from './_components/table/da-summary-table'

export default async function Page() {
  const items = await getDaSummaryEntries()

  return (
    <div>
      <DaFilterContextProvider>
        <SimplePageHeader className="mb-4 sm:mb-8">Summary</SimplePageHeader>
        <DaSummaryTable items={items} />
      </DaFilterContextProvider>
    </div>
  )
}
