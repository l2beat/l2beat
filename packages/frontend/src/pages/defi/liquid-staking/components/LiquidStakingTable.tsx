import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Badge } from '~/components/badge/Badge'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { ChevronIcon } from '~/icons/Chevron'
import type { LiquidStakingEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import { cn } from '~/utils/cn'
import { LIQUID_STAKING_METRICS } from '../liquidStakingMetrics'
import { LIQUID_STAKING_RISKS } from '../liquidStakingRisks'
import {
  getLiquidStakingStatColumns,
  TVL_COLUMN_ID,
} from './liquidStakingColumns'

const columnHelper = createColumnHelper<LiquidStakingEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <ProjectNameCell
          project={{
            name: ctx.row.original.name,
            shortName: ctx.row.original.shortName,
            slug: ctx.row.original.slug,
            icon: ctx.row.original.icon,
            backgroundColor: undefined,
            description: ctx.row.original.description,
            statuses: {
              underReview: ctx.row.original.isUnderReview
                ? 'config'
                : undefined,
            },
          }}
        />
      </TableLink>
    ),
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  ...getLiquidStakingStatColumns(columnHelper),
  // An unreviewed protocol's first risk cell spans the others, which hide.
  ...LIQUID_STAKING_RISKS.map(({ key, title, tooltip }, i) =>
    columnHelper.accessor((entry) => entry.risks?.[key] ?? null, {
      id: key,
      header: title,
      cell: (ctx) => {
        const value = ctx.getValue()
        return value ? (
          <TableValueCell value={value} href={ctx.row.original.href} />
        ) : (
          <Badge type="gray" size="small">
            Not reviewed
          </Badge>
        )
      },
      enableSorting: false,
      meta:
        i === 0
          ? {
              tooltip,
              colSpan: (ctx) => (ctx.row.original.risks ? 1 : 100),
            }
          : { tooltip, hideIfNull: true },
    }),
  ),
]

/** The chart values start hidden; the column controls show them. */
const HIDDEN_METRICS = Object.fromEntries(
  LIQUID_STAKING_METRICS.map(({ key }) => [key, false]),
)

const initialSorting: SortingState = [{ id: TVL_COLUMN_ID, desc: true }]

export function LiquidStakingTable({
  entries,
}: {
  entries: LiquidStakingEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [showUnreviewed, setShowUnreviewed] = useState(false)
  const reviewed = useMemo(
    () => entries.filter((entry) => entry.risks !== undefined),
    [entries],
  )
  const unreviewedCount = entries.length - reviewed.length

  const table = useTable('LiquidStakingTable', {
    data: showUnreviewed ? entries : reviewed,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    initialState: { columnVisibility: HIDDEN_METRICS },
    onSortingChange: setSorting,
  })

  return (
    <div className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} dense />
      {unreviewedCount > 0 && (
        <button
          type="button"
          aria-expanded={showUnreviewed}
          onClick={() => setShowUnreviewed((show) => !show)}
          className="mx-auto mt-3 flex cursor-pointer items-center gap-2.5 rounded-md border border-divider px-3 py-1.5 font-medium text-label-value-13 text-primary leading-4 transition-colors hover:bg-surface-secondary"
        >
          {showUnreviewed
            ? 'Show fewer'
            : `Show ${unreviewedCount} more ${unreviewedCount === 1 ? 'protocol' : 'protocols'}`}
          <ChevronIcon
            className={cn(
              'size-3 fill-current transition-transform duration-300',
              showUnreviewed && 'rotate-180',
            )}
          />
        </button>
      )}
    </div>
  )
}
