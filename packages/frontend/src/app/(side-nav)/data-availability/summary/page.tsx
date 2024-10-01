import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { DaFilterContextProvider } from '../_components/filters/da-filter-context'
import { DaSummaryTable } from './_components/table/da-summary-table'

export default async function Page() {
  const items = await getDaSummaryEntries()

  return (
    <div>
      <DaFilterContextProvider>
        <MainPageHeader>Summary</MainPageHeader>
        <MainPageCard>
          <DaSummaryTable items={items} />
        </MainPageCard>
      </DaFilterContextProvider>
    </div>
  )
}
