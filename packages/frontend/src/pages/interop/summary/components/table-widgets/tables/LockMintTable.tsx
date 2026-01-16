import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { lockMintColumns } from './columns'

export type LockMintRow =
  InteropDashboardData['protocolsByType']['lockMint'][number] & BasicTableRow

export function LockMintTable({
  entries,
}: {
  entries: InteropDashboardData['protocolsByType']['lockMint'] | undefined
}) {
  const table = useTable<LockMintRow>({
    data: entries ?? [],
    columns: lockMintColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [],
    },
  })

  if (!entries) return null

  return <BasicTable table={table} />
}
