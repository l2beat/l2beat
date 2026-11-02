import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import { WalkAwayNotPassedIcon } from '~/icons/WalkAwayNotPassed'
import { WalkAwayPassedIcon } from '~/icons/WalkAwayPassed'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { L2ArchivedTable } from './table/L2ArchivedTable'

// Both sections always render, so a section the filters empty shows
// the table's own "No results" state instead of disappearing.
const WALK_AWAY_SECTIONS = [
  {
    verdict: 'passed',
    title: 'Pass the walkaway test',
    description: 'Users can exit in the absence of operators.',
    icon: <WalkAwayPassedIcon className="size-6 shrink-0 fill-positive" />,
  },
  {
    verdict: 'not-passed',
    title: 'Do not pass the walkaway test',
    description:
      "Users cannot count on exiting in the absence of operators, or the project's contracts were exploited.",
    icon: <WalkAwayNotPassedIcon className="size-6 shrink-0 fill-negative" />,
  },
] as const

interface Props {
  entries: L2ArchivedEntry[]
}

export function L2ArchivedTableSection(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = props.entries.filter(filterEntries)

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <TableFilters
        className="max-md:mt-4 max-md:px-4"
        entries={props.entries}
      />
      {WALK_AWAY_SECTIONS.map(({ verdict, ...section }, i) => (
        <PrimaryCard key={verdict} className={i === 0 ? 'mt-4' : 'mt-6'}>
          <TableSortingProvider initialSort={initialSort}>
            <L2ArchivedTable
              {...section}
              entries={entries.filter((entry) => entry.walkAway === verdict)}
            />
          </TableSortingProvider>
        </PrimaryCard>
      ))}
    </>
  )
}
