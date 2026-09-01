import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { L2RiskSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'
import { l2SequencingColumns } from './columns'

interface Props {
  entries: L2RiskSequencingEntry[]
}

export function L2RiskSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: l2SequencingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h2 className="font-bold text-heading-16 md:text-heading-20">
          Decentralized Sequencing
        </h2>
        <ColumnsControls columns={table.getAllColumns()} />
      </div>
      <BasicTable table={table} />
    </>
  )
}
