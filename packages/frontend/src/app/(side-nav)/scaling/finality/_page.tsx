import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import type { TabbedScalingEntries } from '../../../../pages/scaling/utils/group-by-scaling-tabs'
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
