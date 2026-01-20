import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { NonMintingProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { nonMintingColumns } from './columns'

export type NonMintingRow = NonMintingProtocolEntry & BasicTableRow

export function NonMintingTable({
  entries,
}: {
  entries: NonMintingProtocolEntry[] | undefined
}) {
  const table = useTable<NonMintingRow>({
    data: entries ?? [],
    columns: nonMintingColumns,
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

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
