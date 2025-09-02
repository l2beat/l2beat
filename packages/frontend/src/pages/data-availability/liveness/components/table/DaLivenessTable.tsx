import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { DaLivenessEntry } from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import { publicColumns } from './columns'

export function DaLivenessTable({ items }: { items: DaLivenessEntry[] }) {
  const table = useTable({
    columns: publicColumns,
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
