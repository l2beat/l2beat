import type { ScalingFinalityEntry } from 'rewrite/src/server/features/scaling/finality/get-scaling-finality-entries'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { FinalityHeader } from './_components/finality-header'
import { ScalingFinalityTables } from './_components/scaling-finality-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingFinalityEntry>
}

export function ScalingFinalityPage({ entries }: Props) {
  return (
    <>
      <FinalityHeader />
      <TableFilterContextProvider>
        <ScalingFinalityTables {...entries} />
      </TableFilterContextProvider>
      {/* <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} /> */}
    </>
  )
}
