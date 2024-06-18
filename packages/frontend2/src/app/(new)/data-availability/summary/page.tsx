import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { api } from '~/trpc/server'
import { DaSummaryTable } from './_components/table/da-summary-table'

export default async function Page() {
  const items = await api.dataAvailability.summary()
  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">Summary</SimplePageHeader>
      <DaSummaryTable items={items} />
    </div>
  )
}
