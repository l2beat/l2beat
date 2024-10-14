import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import {
  type DaRiskEntry,
  getDaRiskEntries,
} from '~/server/features/data-availability/risks/get-da-risk-entries'
import { DaRiskTable } from './_components/table/da-risk-table'

export default async function Page() {
  const items = await getDaRiskEntries()
  const { dacs, other } = items.reduce<Record<'dacs' | 'other', DaRiskEntry[]>>(
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
      <MainPageHeader>Risk Analysis</MainPageHeader>
      <div className="flex flex-col gap-6">
        <MainPageCard className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Public blockchains</h2>
          <DaRiskTable items={other} />
        </MainPageCard>
        <MainPageCard className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">DACs</h2>
          <DaRiskTable items={dacs} />
        </MainPageCard>
      </div>
    </div>
  )
}
