import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { api } from '~/trpc/server'
import { DaRiskTable } from './_components/table/da-risk-table'

export default async function Page() {
  const items = await api.dataAvailability.risk()

  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">
        Risk Analysis
      </SimplePageHeader>
      <DaRiskTable items={items} />
    </div>
  )
}
