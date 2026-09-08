import { formatInteger } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { AuditsSummaryEntry } from '~/server/features/audits/types'
import {
  LineCoverageBar,
  LineCoverageTooltipContent,
  UnitStatusBar,
  UnitStatusBarTooltipContent,
} from '../../components/AuditCoverageBar'
import { formatShare, totalUnits } from '../../components/auditStatus'

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
  columnHelper.accessor('contracts', {
    header: 'Contracts',
    cell: (ctx) => (
      <span className="font-medium text-sm">
        {formatInteger(ctx.getValue())}
        {ctx.row.original.contractsWithoutSource > 0 && (
          <span className="text-secondary">
            {' '}
            ({ctx.row.original.contractsWithoutSource} w/o source)
          </span>
        )}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'Deployed contracts in the dataset (critical contracts from discovery). Contracts without verified source have no units.',
    },
  }),
  columnHelper.accessor((e) => totalUnits(e.coverage.units), {
    id: 'units',
    header: 'Units',
    cell: (ctx) => {
      const counts = ctx.row.original.coverage.units
      return (
        <Tooltip>
          <TooltipTrigger className="flex w-[220px] flex-col gap-1">
            <span className="flex justify-between font-medium text-xs">
              <span>{formatInteger(totalUnits(counts))} units</span>
              <span className="text-secondary">
                {formatInteger(counts.identical + counts.library)} audited
              </span>
            </span>
            <UnitStatusBar counts={counts} />
          </TooltipTrigger>
          <TooltipContent>
            <UnitStatusBarTooltipContent counts={counts} />
          </TooltipContent>
        </Tooltip>
      )
    },
    meta: {
      tooltip:
        'Deployed Solidity units (contracts, interfaces, libraries) by status: identical to audited code, identical to an audited standard library, differing from audited code, or without audited source.',
    },
  }),
  columnHelper.accessor(
    (e) =>
      e.coverage.lines.total === 0
        ? 0
        : e.coverage.lines.covered / e.coverage.lines.total,
    {
      id: 'linesCovered',
      header: 'Lines covered',
      cell: (ctx) => {
        const lines = ctx.row.original.coverage.lines
        return (
          <Tooltip>
            <TooltipTrigger className="flex w-[220px] flex-col gap-1">
              <span className="flex justify-between font-medium text-xs">
                <span>{formatShare(lines.covered, lines.total)}</span>
                <span className="text-secondary">
                  {formatInteger(lines.covered)} / {formatInteger(lines.total)}
                </span>
              </span>
              <LineCoverageBar lines={lines} />
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
          'Share of deployed lines that are covered by audits: all lines of identical and standard library units plus the unchanged lines of differing units.',
      },
    },
  ),
  columnHelper.accessor('reportsCount', {
    header: 'Audits',
    cell: (ctx) => (
      <span className="font-medium text-sm">
        {ctx.getValue()}
        {ctx.row.original.libraryReportsCount > 0 && (
          <span className="text-secondary">
            {' '}
            +{ctx.row.original.libraryReportsCount} lib
          </span>
        )}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        "Audit reports that matched at least one deployed unit: the project's own reports, plus standard library reports.",
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
  const table = useTable({
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
