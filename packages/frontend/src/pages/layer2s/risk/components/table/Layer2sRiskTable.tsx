import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { Layer2sRiskEntry } from '~/server/features/layer2s/risks/getLayer2sRiskEntries'
import { layer2sRiskColumns } from './columns'

export function Layer2sRiskTable({ entries }: { entries: Layer2sRiskEntry[] }) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: layer2sRiskColumns,
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

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}
