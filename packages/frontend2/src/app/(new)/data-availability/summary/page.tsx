import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { DaSummaryTable } from './_components/table/da-summary-table'
import { api } from '~/trpc/server'

export default async function Page() {
  const items = await api.dataAvailability.summary()
  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">Summary</SimplePageHeader>
      <DaSummaryTable items={items} />
    </div>
  )
}
