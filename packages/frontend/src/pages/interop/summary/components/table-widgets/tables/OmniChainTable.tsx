import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { type OmniChainProtocolRow, omniChainColumns } from './columns'
import type { OmniChainProtocolEntry } from './getBridgeTypeEntries'

export function OmniChainTable({
  entries,
}: {
  entries: OmniChainProtocolEntry[]
}) {
  const table = useTable<OmniChainProtocolRow>({
    data: entries,
    columns: omniChainColumns,
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
