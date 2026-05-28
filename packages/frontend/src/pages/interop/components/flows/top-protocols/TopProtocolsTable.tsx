import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { type TopProtocolRow, topProtocolsColumns } from './columns'

export function TopProtocolsTable({
  protocols,
}: {
  protocols: ProtocolEntry[]
}) {
  const table = useTable<TopProtocolRow>({
    data: protocols,
    columns: topProtocolsColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['name'],
      },
    },
  })

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
