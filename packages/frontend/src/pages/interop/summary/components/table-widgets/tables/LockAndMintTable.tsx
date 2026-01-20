import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { LockAndMintProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { lockAndMintColumns } from './columns'

export type LockAndMintRow = LockAndMintProtocolEntry & BasicTableRow

export function LockAndMintTable({
  entries,
}: {
  entries: LockAndMintProtocolEntry[] | undefined
}) {
  const table = useTable<LockAndMintRow>({
    data: entries ?? [],
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

  if (!entries) return null

  return <BasicTable table={table} />
}
