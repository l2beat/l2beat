import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { publicSystemsColumns } from './columns'

export function DaSummaryPublicTable({ items }: { items: DaSummaryEntry[] }) {
  const table = useTable({
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

  return <BasicTable table={table} />
}
