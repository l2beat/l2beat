import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { getAllProtocolsColumns, type ProtocolRow } from './columns'

export function AllProtocolsTable({
  hideTypeColumn,
  entries,
}: {
  entries: ProtocolEntry[]
  hideTypeColumn?: boolean
}) {
  const columns = useMemo(
    () => getAllProtocolsColumns(hideTypeColumn),
    [hideTypeColumn],
  )

  const table = useTable<ProtocolRow>({
    data: entries,
    columns,
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
