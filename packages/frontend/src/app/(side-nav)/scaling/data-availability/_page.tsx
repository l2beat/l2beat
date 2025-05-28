import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import type { TabbedScalingEntries } from '../../../../pages/scaling/utils/group-by-scaling-tabs'
import { ScalingDaTables } from './_components/scaling-da-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingDaEntry>
}

export function ScalingDaPage({ entries }: Props) {
  return (
    <>
      <MainPageHeader>Data Availability</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingDaTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
