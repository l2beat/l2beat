import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { DaFilterContextProvider } from '../_components/filters/da-filter-context'
import { DaRiskTable } from './_components/table/da-risk-table'

export default async function Page() {
  const items = await getDaRiskEntries()

  return (
    <div>
      <DaFilterContextProvider>
        <SimplePageHeader className="mb-4 sm:mb-8">
          Risk Analysis
        </SimplePageHeader>
        <DaRiskTable items={items} />
      </DaFilterContextProvider>
    </div>
  )
}
