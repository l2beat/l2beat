import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { getTabTableCaption } from '~/components/table/getTabTableCaption'
import { useTable } from '~/hooks/useTable'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { publicSystemsColumns } from './columns'

export function DaSummaryPublicTable({ items }: { items: DaSummaryEntry[] }) {
  const table = useTable('DaSummaryPublicTable', {
    columns: publicSystemsColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable
        caption={getTabTableCaption('Data availability summary', 'Public')}
        table={table}
      />
    </>
  )
}
