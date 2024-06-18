import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { DaRiskTable } from './_components/table/da-risk-table'
import { getDaRiskEntries } from '~/server/features/data-availability/get-da-risk-entries'

export default async function Page() {
  const items = await getDaRiskEntries()

  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">
        Risk Analysis
      </SimplePageHeader>
      <DaRiskTable items={items} />
    </div>
  )
}
