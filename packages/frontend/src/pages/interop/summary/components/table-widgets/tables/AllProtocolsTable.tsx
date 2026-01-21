import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { allProtocolsColumns } from './columns'

export type AllProtocolsRow = ProtocolEntry & BasicTableRow

export function AllProtocolsTable({
  entries,
}: {
  entries: ProtocolEntry[] | undefined
}) {
  const table = useTable<AllProtocolsRow>({
    data: entries ?? [],
    columns: allProtocolsColumns,
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
