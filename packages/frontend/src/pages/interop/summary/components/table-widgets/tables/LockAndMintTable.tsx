import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { getLockAndMintColumns, type LockAndMintProtocolRow } from './columns'
import type { LockAndMintProtocolEntry } from './getBridgeTypeEntries'

export function LockAndMintTable({
  entries,
}: {
  entries: LockAndMintProtocolEntry[]
}) {
  const columns = useMemo(() => getLockAndMintColumns(), [])

  const table = useTable<LockAndMintProtocolRow>({
    data: entries,
    columns,
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

  return (
    <BasicTable table={table} tableWrapperClassName="pb-0 md:min-h-[210px]" />
  )
}
