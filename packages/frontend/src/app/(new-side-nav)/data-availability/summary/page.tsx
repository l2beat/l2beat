import { MainPageCard } from '~/components/main-page-card'
import {
  type DaSummaryEntry,
  getDaSummaryEntries,
} from '~/server/features/data-availability/summary/get-da-summary-entries'
import { DaSummaryDacsTable } from './_components/table/da-summary-dacs-table'
import { DaSummaryTable } from './_components/table/da-summary-table'

export default async function Page() {
  const items = await getDaSummaryEntries()
  const { dacs, other } = items.reduce<
    Record<'dacs' | 'other', DaSummaryEntry[]>
  >(
    (acc, item) => {
      if (item.kind === 'DAC') {
        acc.dacs.push(item)
      } else {
        acc.other.push(item)
      }
      return acc
    },
    { dacs: [], other: [] },
  )

  return (
    <div>
      <h1 className="my-5 ml-6 text-3xl font-bold max-lg:hidden">Summary</h1>
      <div className="flex flex-col gap-6">
        <MainPageCard className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Public blockchains</h2>
          <DaSummaryTable items={other} />
        </MainPageCard>
        <MainPageCard className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">DACs</h2>
          <DaSummaryDacsTable items={dacs} />
        </MainPageCard>
      </div>
    </div>
  )
}
