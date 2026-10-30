import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import { WalkAwayNotPassedIcon } from '~/icons/WalkAwayNotPassed'
import { WalkAwayPassedIcon } from '~/icons/WalkAwayPassed'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { l2ArchivedColumns } from './columns'

const WALK_AWAY_SECTIONS = {
  passed: {
    title: 'Pass the walkaway test',
    description:
      'Users can exit in the presence of malicious operators even if the team disappears.',
    icon: <WalkAwayPassedIcon className="size-6 shrink-0 fill-positive" />,
  },
  'not-passed': {
    title: 'Do not pass the walkaway test',
    description:
      "Users cannot count on exiting in the presence of malicious operators if the team disappears, or the project's contracts were exploited.",
    icon: <WalkAwayNotPassedIcon className="size-6 shrink-0 fill-negative" />,
  },
}

interface Props {
  entries: L2ArchivedEntry[]
  walkAway: 'passed' | 'not-passed'
}

export function L2ArchivedTable({ entries, walkAway }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const table = useTable('L2ArchivedTable', {
    data: entries,
    columns: l2ArchivedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  const section = WALK_AWAY_SECTIONS[walkAway]

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 md:flex-1">
          <div className="flex items-center gap-1.5">
            {section.icon}
            <h2 className="font-bold text-heading-16 md:text-heading-20">
              {section.title}
            </h2>
            <span className="ml-0.5 font-medium text-label-value-14 text-secondary md:text-label-value-15">
              {entries.length}
            </span>
          </div>
          <p className="mt-1 text-paragraph-14 text-secondary md:text-paragraph-15">
            {section.description}
          </p>
        </div>
        <ColumnsControls columns={table.getAllColumns()} />
      </div>
      <BasicTable table={table} />
    </>
  )
}
