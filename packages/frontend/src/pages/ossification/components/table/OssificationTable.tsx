import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  formatContractCount,
  formatCriticalChangesPerYear,
} from '~/components/ossification/formatCriticalChangesPerYear'
import { OssificationExposure } from '~/components/ossification/OssificationExposure'
import { OssificationScore } from '~/components/ossification/OssificationScore'
import { OssificationTimelineChart } from '~/components/ossification/OssificationTimelineChart'
import { OSSIFICATION_TOOLTIPS } from '~/components/ossification/ossificationTooltips'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ExitWindowCell } from '~/components/table/cells/ExitWindowCell'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { OssificationEntry } from '~/server/features/projects/ossification/getOssificationEntries'
import { formatTimestamp } from '~/utils/dates'

const columnHelper = createColumnHelper<OssificationEntry>()

const getOssificationHref = (entry: OssificationEntry) =>
  entry.href && `${entry.href}#ossification`

const columns = [
  ...getCommonProjectColumns(columnHelper, getOssificationHref),
  columnHelper.accessor('name', {
    header: 'Project',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={getOssificationHref(ctx.row.original)}>
        <TwoRowCell>
          <TwoRowCell.First>
            <ProjectNameCell
              project={{
                name: ctx.row.original.name,
                slug: ctx.row.original.slug,
                icon: ctx.row.original.icon,
                detailsHref: ctx.row.original.href,
                backgroundColor: ctx.row.original.backgroundColor,
                statuses: ctx.row.original.statuses,
              }}
            />
          </TwoRowCell.First>
          <TwoRowCell.Second>{ctx.row.original.category}</TwoRowCell.Second>
        </TwoRowCell>
      </TableLink>
    ),
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  columnHelper.accessor('score', {
    header: 'Ossification %\nunchanged since',
    cell: (ctx) => (
      <TwoRowCell>
        <TwoRowCell.First>
          <OssificationScore
            score={ctx.getValue()}
            isUnverified={ctx.row.original.isUnverified}
          />
        </TwoRowCell.First>
        <TwoRowCell.Second>
          {formatTimestamp(ctx.row.original.timeline.clockStart)}
        </TwoRowCell.Second>
      </TwoRowCell>
    ),
    meta: {
      tooltip: OSSIFICATION_TOOLTIPS.score,
    },
  }),
  columnHelper.display({
    id: 'timeline',
    header: 'TVS &\nchanges (1Y)',
    cell: (ctx) => (
      <OssificationTimelineChart
        timeline={ctx.row.original.timeline}
        valueSource={ctx.row.original.valueSource}
        className="ml-auto"
      />
    ),
    meta: {
      tooltip: OSSIFICATION_TOOLTIPS.timeline,
    },
  }),
  // TanStack sorts only undefined last, not null.
  columnHelper.accessor((entry) => entry.exposure ?? undefined, {
    id: 'exposure',
    header: 'Battle-tested\nexposure',
    cell: (ctx) => (
      <span className="font-medium text-sm">
        <OssificationExposure
          exposure={ctx.row.original.exposure}
          valueSource={ctx.row.original.valueSource}
        />
      </span>
    ),
    sortUndefined: 'last',
    meta: {
      tooltip: OSSIFICATION_TOOLTIPS.exposure,
    },
  }),
  columnHelper.accessor('criticalChangesPerYear', {
    header: 'Critical\nchanges / year',
    cell: (ctx) => (
      <TwoRowCell>
        <TwoRowCell.First>
          {formatCriticalChangesPerYear(ctx.row.original)}
        </TwoRowCell.First>
        <TwoRowCell.Second>
          {formatContractCount(ctx.row.original.contractCount)}
        </TwoRowCell.Second>
      </TwoRowCell>
    ),
    meta: {
      tooltip: OSSIFICATION_TOOLTIPS.criticalChangesPerYear,
    },
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.exitWindow), {
    id: 'exitWindow',
    header: 'Exit\nwindow',
    cell: (ctx) => {
      const exitWindow = ctx.row.original.exitWindow
      return exitWindow ? (
        <ExitWindowCell value={exitWindow} />
      ) : (
        <TableValueCell value={undefined} emptyMode="n/a" />
      )
    },
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.exitWindow, b.original.exitWindow),
    meta: {
      tooltip: OSSIFICATION_TOOLTIPS.exitWindow,
    },
  }),
]

// Ties keep the server order, which breaks them by exposure.
const initialSorting: SortingState = [{ id: 'score', desc: true }]

export function OssificationTable({
  entries,
}: {
  entries: OssificationEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable('OssificationTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    onSortingChange: setSorting,
  })

  return (
    <PrimaryCard className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
