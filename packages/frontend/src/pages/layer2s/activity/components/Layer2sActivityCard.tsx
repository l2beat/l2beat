import type { Milestone } from '@l2beat/config'
import { Layer2sActivityChart } from '~/components/chart/activity/Layer2sActivityChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { Layer2sActivityEntry } from '~/server/features/layer2s/activity/getLayer2sActivityEntries'
import { UopsExplorerLink } from '../../components/UopsExplorerLink'
import { Layer2sActivityTable } from './table/Layer2sActivityTable'

type Props = {
  entries: Layer2sActivityEntry[]
  milestones: Milestone[]
}

export function Layer2sActivityCard(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = props.entries.filter(filterEntries)

  const initialSort = {
    id: 'data_pastDayCount',
    desc: true,
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 max-md:mt-4 max-md:px-4">
        <TableFilters entries={props.entries} />
        <UopsExplorerLink />
      </div>

      <PrimaryCard className="mt-4">
        <Layer2sActivityChart entries={entries} milestones={props.milestones} />
        <HorizontalSeparator className="mt-5 mb-3" />
        <TableSortingProvider initialSort={initialSort}>
          <Layer2sActivityTable entries={entries} />
        </TableSortingProvider>
      </PrimaryCard>
    </>
  )
}
