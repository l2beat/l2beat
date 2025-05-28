import type { ScalingDaEntry } from 'rewrite/src/server/features/scaling/data-availability/get-scaling-da-entries'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
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
