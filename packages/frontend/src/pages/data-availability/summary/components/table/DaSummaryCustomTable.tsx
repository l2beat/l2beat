import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useTable } from '~/hooks/useTable'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { BasicDaTable } from '../../../components/BasicDaTable'
import { customColumns } from './columns'

export function DaSummaryCustomTable({ items }: { items: DaSummaryEntry[] }) {
  const table = useTable({
    columns: customColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <BasicDaTable table={table} />
}
