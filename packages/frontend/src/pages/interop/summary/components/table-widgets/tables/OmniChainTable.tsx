import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { omniChainColumns, type ProtocolRow } from './columns'

export function OmniChainTable({ entries }: { entries: ProtocolEntry[] }) {
  const table = useTable<ProtocolRow>({
    data: entries,
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

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
