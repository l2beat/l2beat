import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { type TopProtocolRow, topProtocolsColumns } from './columns'

export function TopProtocolsTable({
  protocols,
}: {
  protocols: ProtocolEntry[]
}) {
  const rows = useMemo<TopProtocolRow[]>(
    () => protocols.map((p) => ({ ...p, icon: p.iconUrl })),
    [protocols],
  )
  const table = useTable<TopProtocolRow>({
    data: rows,
    columns: topProtocolsColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
