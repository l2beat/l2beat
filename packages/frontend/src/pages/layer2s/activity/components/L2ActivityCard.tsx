import type { Milestone } from '@l2beat/config'
import { L2ActivityChart } from '~/components/chart/activity/L2ActivityChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import { UopsExplorerLink } from '../../components/UopsExplorerLink'
import { L2ActivityTable } from './table/L2ActivityTable'

type Props = {
  entries: L2ActivityEntry[]
  milestones: Milestone[]
}

export function L2ActivityCard(props: Props) {
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
        <L2ActivityChart entries={entries} milestones={props.milestones} />
        <HorizontalSeparator className="mt-5 mb-3" />
        <TableSortingProvider initialSort={initialSort}>
          <L2ActivityTable entries={entries} />
        </TableSortingProvider>
      </PrimaryCard>
    </>
  )
}
