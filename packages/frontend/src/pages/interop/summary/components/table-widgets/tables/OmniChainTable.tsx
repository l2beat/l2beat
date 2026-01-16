import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { omniChainColumns } from './columns'

export type OmniChainRow =
  InteropDashboardData['protocolsByType']['omniChain'][number] & BasicTableRow

export function OmniChainTable({
  entries,
}: {
  entries: InteropDashboardData['protocolsByType']['omniChain'] | undefined
}) {
  const table = useTable<OmniChainRow>({
    data: entries ?? [],
    columns: omniChainColumns,
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
