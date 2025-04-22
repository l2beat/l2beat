import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { BridgesRiskEntry } from '~/server/features/bridges/get-bridges-risk-entries'
import { BridgesHeader } from '../_components/bridges-header'
import { BridgesRiskTable } from './_components/table/bridges-risks-table'

interface Props {
  entries: BridgesRiskEntry[]
}

export function BridgesRiskPage({ entries }: Props) {
  return (
    <>
      <TableFilterContextProvider>
        <BridgesHeader>Risk Analysis</BridgesHeader>
        <PrimaryCard>
          <BridgesRiskTable entries={entries} />
        </PrimaryCard>
      </TableFilterContextProvider>
    </>
  )
}
