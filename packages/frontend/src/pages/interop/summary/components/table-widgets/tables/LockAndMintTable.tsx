import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { lockAndMintColumns } from './columns'

export type LockAndMintRow = ProtocolEntry & BasicTableRow

export function LockAndMintTable({ entries }: { entries: ProtocolEntry[] }) {
  const table = useTable<LockAndMintRow>({
    data: entries,
    columns: lockAndMintColumns,
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
