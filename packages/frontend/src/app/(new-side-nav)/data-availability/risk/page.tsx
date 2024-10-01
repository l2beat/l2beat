import { SimplePageHeader } from '~/components/simple-page-header'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { DaRiskTable } from './_components/table/da-risk-table'
import { groupBy } from 'lodash'

export default async function Page() {
  const items = await getDaRiskEntries()
  const grouped = groupBy(items, (item) => item.layerType)

  return (
    <div>
        <SimplePageHeader className="mb-4 sm:mb-8">
          Risk Analysis
        </SimplePageHeader>
        {Object.entries(grouped).map(([layerType, items]) => (
          <DaRiskTable key={layerType} items={items} />
        ))}
    </div>
  )
}
