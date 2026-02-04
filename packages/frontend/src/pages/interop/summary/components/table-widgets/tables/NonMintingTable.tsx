import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { type NonMintingProtocolRow, nonMintingColumns } from './columns'
import type { NonMintingProtocolEntry } from './getBridgeTypeEntries'

export function NonMintingTable({
  entries,
}: {
  entries: NonMintingProtocolEntry[]
}) {
  const table = useTable<NonMintingProtocolRow>({
    data: entries,
    columns: nonMintingColumns,
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
