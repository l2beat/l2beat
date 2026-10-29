import { formatCurrency } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { LiquidStakingStats } from '~/server/features/defi/liquid-staking/computeLiquidStakingCharts'
import type { LiquidStakingEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import { formatDays, formatYield } from '../formatLiquidStaking'
import { LIQUID_STAKING_RISKS } from '../liquidStakingRisks'

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
  columnHelper.accessor('totalValueLockedUsd', {
    header: 'TVL',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === undefined ? (
        <NoDataBadge />
      ) : (
        <span className="font-medium text-sm">
          {formatCurrency(value, 'usd')}
        </span>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Total USD value of assets locked in the protocol.',
    },
  }),
  statColumn('yield', 'Yield', formatYield, {
    tooltip:
      "What a holder earned over the last 30 days, net of protocol fees: the annualised change of the token's exchange rate.",
  }),
  statColumn('costOfExit', 'Cost of exit', formatDays, {
    tooltip:
      'Days of yield a holder gives up to exit, by the cheaper of waiting for a protocol withdrawal and selling at the market discount.',
  }),
  statColumn('queueWait', 'Queue wait', formatDays, {
    tooltip:
      "How long a protocol withdrawal takes: for Lido and ether.fi, the average wait of the latest day's requests; Rocket Pool pays out at once while its deposit pool holds ETH; for wBETH, the operator-set lock time.",
  }),
  statColumn('marketDiscount', 'Market discount', formatYield, {
    tooltip:
      'How far below its ETH backing the token trades, as a 7-day median of market prices. Negative at a premium.',
  }),
  ...LIQUID_STAKING_RISKS.map(({ key, title, tooltip }) =>
    columnHelper.accessor((entry) => entry.risks[key], {
      id: key,
      header: title,
      cell: (ctx) => (
        <TableValueCell value={ctx.getValue()} href={ctx.row.original.href} />
      ),
      enableSorting: false,
      meta: { tooltip },
    }),
  ),
]

/** The chart values, hidden until picked in the column controls. */
const STAT_COLUMNS = [
  'yield',
  'costOfExit',
  'queueWait',
  'marketDiscount',
] as const satisfies (keyof LiquidStakingStats)[]

function statColumn(
  key: (typeof STAT_COLUMNS)[number],
  header: string,
  format: (value: number) => string,
  { tooltip }: { tooltip: string },
) {
  return columnHelper.accessor((entry) => entry.stats[key] ?? undefined, {
    id: key,
    header,
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === undefined ? (
        <NoDataBadge />
      ) : (
        <span className="font-medium text-sm">{format(value)}</span>
      )
    },
    sortUndefined: 'last',
    meta: { align: 'right', tooltip },
  })
}

const HIDDEN_STAT_COLUMNS = Object.fromEntries(
  STAT_COLUMNS.map((key) => [key, false]),
)

const initialSorting: SortingState = [{ id: 'totalValueLockedUsd', desc: true }]

export function LiquidStakingTable({
  entries,
}: {
  entries: LiquidStakingEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable('LiquidStakingTable', {
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
    initialState: { columnVisibility: HIDDEN_STAT_COLUMNS },
    onSortingChange: setSorting,
  })

  return (
    <div className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </div>
  )
}
