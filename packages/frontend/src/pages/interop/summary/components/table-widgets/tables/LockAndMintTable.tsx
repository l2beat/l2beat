import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { type LockAndMintProtocolRow, lockAndMintColumns } from './columns'
import type { LockAndMintProtocolEntry } from './getBridgeTypeEntries'

export function LockAndMintTable({
  entries,
}: {
  entries: LockAndMintProtocolEntry[]
}) {
  const table = useTable<LockAndMintProtocolRow>({
    data: entries,
    columns: lockAndMintColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
