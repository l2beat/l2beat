import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { lockMintColumns } from './columns'

export type LockMintRow =
  InteropDashboardData['protocolsByType']['lockMint'][number] & BasicTableRow

export function LockMintTable({
  entires,
}: {
  entires: InteropDashboardData['protocolsByType']['lockMint'] | undefined
}) {
  const activeTable = useTable<LockMintRow>({
    data: entires ?? [],
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

  if (!entires) return null

  return <BasicTable table={activeTable} />
}
