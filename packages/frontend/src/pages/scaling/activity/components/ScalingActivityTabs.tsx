import type { Milestone } from '@l2beat/config'
import { ScalingActivityChart } from '~/components/chart/activity/ScalingActivityChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { UopsExplorerLink } from '../../components/UopsExplorerLink'
import { ScalingActivityTable } from './table/ScalingActivityTable'

type Props = {
  entries: ScalingActivityEntry[]
  milestones: Milestone[]
}
export function ScalingActivityTabs(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = props.entries.filter(filterEntries)

  const initialSort = {
    id: 'data_pastDayCount',
    desc: true,
  }

  return (
    <>
      <div className="mr-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
        <TableFilters entries={props.entries} />
        <UopsExplorerLink />
      </div>

      <TableSortingProvider initialSort={initialSort}>
        <PrimaryCard className="mt-2">
          <ScalingActivityChart
            entries={entries}
            milestones={props.milestones}
            type="Rollups"
          />

          <HorizontalSeparator className="mt-5 mb-3" />
          <ScalingActivityTable entries={entries} />
        </PrimaryCard>
      </TableSortingProvider>
    </>
  )
}
