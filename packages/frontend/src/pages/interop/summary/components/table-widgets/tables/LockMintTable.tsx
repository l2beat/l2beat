import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { LockMintProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { lockMintColumns } from './columns'

export type LockMintRow = LockMintProtocolEntry & BasicTableRow

export function LockMintTable({
  entries,
}: {
  entries: LockMintProtocolEntry[] | undefined
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
