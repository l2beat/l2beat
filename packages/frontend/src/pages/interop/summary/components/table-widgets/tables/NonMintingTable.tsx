import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { nonMintingColumns } from './columns'

export type NonMintingRow =
  InteropDashboardData['protocolsByType']['nonMinting'][number] & BasicTableRow

export function NonMintingTable({
  entires,
}: {
  entires: InteropDashboardData['protocolsByType']['nonMinting'] | undefined
}) {
  const activeTable = useTable<NonMintingRow>({
    data: entires ?? [],
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

  if (!entires) return null

  return <BasicTable table={activeTable} />
}
