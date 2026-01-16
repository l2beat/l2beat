import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { nonMintingColumns } from './columns'

export type NonMintingRow =
  InteropDashboardData['protocolsByType']['nonMinting'][number] & BasicTableRow

export function NonMintingTable({
  entries,
}: {
  entries: InteropDashboardData['protocolsByType']['nonMinting'] | undefined
}) {
  const table = useTable<NonMintingRow>({
    data: entries ?? [],
    columns: nonMintingColumns,
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
