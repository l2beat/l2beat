import { BridgesTvsChart } from '~/components/chart/tvs/bridges-tvs-chart'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'
import { BridgesHeader } from '../_components/bridges-header'
import type { TabbedBridgeEntries } from '../_utils/group-by-bridge-tabs'
import { BridgesSummaryTables } from './_components/bridges-summary-tables'

interface Props {
  entries: TabbedBridgeEntries<BridgesSummaryEntry>
}

export function BridgesSummaryPage({ entries }: Props) {
  return (
    <>
      <TableFilterContextProvider>
        <BridgesHeader>Summary</BridgesHeader>
        <PrimaryCard>
          <BridgesTvsChart />
        </PrimaryCard>
        <BridgesSummaryTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
