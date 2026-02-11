import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { type BurnAndMintProtocolRow, burnAndMintColumns } from './columns'
import type { BurnAndMintProtocolEntry } from './getBridgeTypeEntries'

export function BurnAndMintTable({
  entries,
}: {
  entries: BurnAndMintProtocolEntry[]
}) {
  const table = useTable<BurnAndMintProtocolRow>({
    data: entries,
    columns: burnAndMintColumns,
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
