import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { lockAndMintColumns } from '../../../../components/table/columns'

export function LockAndMintTable({ entries }: { entries: ProtocolEntry[] }) {
  const table = useTable({
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
