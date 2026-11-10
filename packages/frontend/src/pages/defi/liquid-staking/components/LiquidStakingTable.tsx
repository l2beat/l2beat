import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTable } from '~/hooks/useTable'
import type { LiquidStakingEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import { LIQUID_STAKING_METRICS } from '../liquidStakingMetrics'
import { LIQUID_STAKING_RISKS } from '../liquidStakingRisks'
import {
  getLiquidStakingNameColumn,
  getLiquidStakingStatColumns,
  TVL_COLUMN_ID,
} from './liquidStakingColumns'

const columnHelper = createColumnHelper<LiquidStakingEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  getLiquidStakingNameColumn(columnHelper),
  ...getLiquidStakingStatColumns(columnHelper),
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
    initialState: { columnVisibility: HIDDEN_METRICS },
    onSortingChange: setSorting,
  })

  return (
    <div className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </div>
  )
}
