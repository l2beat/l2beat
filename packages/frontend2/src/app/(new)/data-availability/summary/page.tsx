import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getDaSummaryEntries } from '~/server/features/data-availability/get-da-summary-entries'
import { DaSummaryTable } from './_components/table/da-summary-table'

export const dynamic = "force-dynamic"

export default async function Page() {
  const items = await getDaSummaryEntries()

  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">Summary</SimplePageHeader>
      <DaSummaryTable items={items} />
    </div>
  )
}
