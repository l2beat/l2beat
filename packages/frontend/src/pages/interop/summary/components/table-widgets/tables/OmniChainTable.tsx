import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import {
  omniChainColumns,
  type ProtocolRow,
} from '../../../../components/table/columns'

export function OmniChainTable({ entries }: { entries: ProtocolEntry[] }) {
  const table = useTable<ProtocolRow>({
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
