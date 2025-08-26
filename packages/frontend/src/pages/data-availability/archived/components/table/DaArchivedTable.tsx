import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { DaArchivedEntry } from '~/server/features/data-availability/archived/getDaArchivedEntries'
import { customColumns, publicColumns } from './columns'

export function DaArchivedTable({
  items,
  excludeBridge = false,
}: {
  items: DaArchivedEntry[]
  excludeBridge?: boolean
}) {
  const table = useTable({
    columns: excludeBridge ? customColumns : publicColumns,
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
