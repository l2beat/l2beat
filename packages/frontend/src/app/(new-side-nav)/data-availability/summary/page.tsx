import { SimplePageHeader } from '~/components/simple-page-header'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { DaSummaryTable } from './_components/table/da-summary-table'
import { groupBy } from 'lodash'

export default async function Page() {
  const items = await getDaSummaryEntries()
  const grouped = groupBy(items, (item) => item.layerType)

  return (
    <div>
        <SimplePageHeader className="mb-4 sm:mb-8">Summary</SimplePageHeader>
        {Object.entries(grouped).map(([layerType, items]) => (
          <DaSummaryTable key={layerType} items={items} />
        ))}
    </div>
  )
}
