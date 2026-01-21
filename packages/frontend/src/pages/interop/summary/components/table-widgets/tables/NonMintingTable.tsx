import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { nonMintingColumns, type ProtocolRow } from './columns'

export function NonMintingTable({ entries }: { entries: ProtocolEntry[] }) {
  const table = useTable<ProtocolRow>({
    data: entries,
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

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
