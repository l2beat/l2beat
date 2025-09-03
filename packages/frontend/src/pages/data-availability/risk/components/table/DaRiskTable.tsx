import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import { customColumns, publicColumns } from './columns'

export function DaRiskTable({
  items,
  excludeBridge = false,
}: {
  items: DaRiskEntry[]
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
