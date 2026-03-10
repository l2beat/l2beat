import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { type BurnAndMintProtocolRow, getBurnAndMintColumns } from './columns'
import type { BurnAndMintProtocolEntry } from './getBridgeTypeEntries'

export function BurnAndMintTable({
  entries,
}: {
  entries: BurnAndMintProtocolEntry[]
}) {
  const columns = useMemo(() => getBurnAndMintColumns(), [])

  const table = useTable<BurnAndMintProtocolRow>({
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
