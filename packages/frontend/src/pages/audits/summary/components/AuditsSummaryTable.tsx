import { formatInteger } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { LineCoverageTooltipContent } from '~/components/audits/AuditCoverageBar'
import { AuditsTimelineChart } from '~/components/audits/AuditsTimelineChart'
import { formatShare } from '~/components/audits/auditStatus'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { formatContractCount } from '~/components/ossification/formatCriticalChangesPerYear'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { linesCoveredShare } from '~/server/features/audits/getAuditsSummaryEntries'
import type { AuditsSummaryEntry } from '~/server/features/audits/types'

const columnHelper = createColumnHelper<AuditsSummaryEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <span className="font-bold text-sm">
          {ctx.row.original.shortName ?? ctx.row.original.name}
        </span>
      </TableLink>
    ),
    enableSorting: false,
    meta: { cellClassName: 'pl-4', headClassName: 'pl-4' },
  }),
  columnHelper.display({
    id: 'timeline',
    header: 'TVS &\naudits (1Y)',
    cell: (ctx) => (
      <AuditsTimelineChart
        timeline={ctx.row.original.timeline}
        valueSource={ctx.row.original.valueSource}
        className="mx-auto"
      />
    ),
    meta: {
      align: 'center',
      tooltip:
        "TVS over one year. Ticks below the baseline are the project's own audit reports; an arrow means the latest one predates the window. Heights are normalized per project.",
    },
  }),
  columnHelper.accessor(linesCoveredShare, {
    id: 'linesCovered',
    header: 'Lines identical\nto audited',
    cell: (ctx) => {
      const lines = ctx.row.original.coverage.lines
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <TwoRowCell>
              <TwoRowCell.First>
                {formatShare(lines.covered, lines.total)}
              </TwoRowCell.First>
              <TwoRowCell.Second>
                {formatContractCount(ctx.row.original.contracts)}
              </TwoRowCell.Second>
            </TwoRowCell>
          </TooltipTrigger>
          <TooltipContent>
            <LineCoverageTooltipContent lines={lines} />
          </TooltipContent>
        </Tooltip>
      )
    },
    sortDescFirst: true,
    meta: {
      tooltip:
        'Share of deployed lines identical to audited code, across the critical contracts.',
    },
  }),
  columnHelper.accessor('ownReportsCount', {
    header: 'Own\naudits',
    cell: (ctx) => (
      <span className="font-medium text-sm">
        {formatInteger(ctx.getValue())}
      </span>
    ),
    sortDescFirst: true,
    meta: {
      align: 'center',
      tooltip: "The project's own audit reports that matched deployed code.",
    },
  }),
  columnHelper.accessor('sharedReportsCount', {
    header: 'Shared\naudits',
    cell: (ctx) => (
      <span className="font-medium text-sm">
        {formatInteger(ctx.getValue())}
      </span>
    ),
    sortDescFirst: true,
    meta: {
      align: 'center',
      tooltip:
        'Reports of upstream code, stacks and libraries that matched deployed code.',
    },
  }),
]

const initialSorting: SortingState = [{ id: 'linesCovered', desc: true }]

export function AuditsSummaryTable({
  entries,
}: {
  entries: AuditsSummaryEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const table = useTable('AuditsSummaryTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnPinning: { left: ['#', 'logo'] } },
    onSortingChange: setSorting,
  })

  return (
    <PrimaryCard className="mt-2">
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
