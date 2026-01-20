import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { OmniChainProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { omniChainColumns } from './columns'

export type OmniChainRow = OmniChainProtocolEntry & BasicTableRow

export function OmniChainTable({
  entries,
}: {
  entries: OmniChainProtocolEntry[] | undefined
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
