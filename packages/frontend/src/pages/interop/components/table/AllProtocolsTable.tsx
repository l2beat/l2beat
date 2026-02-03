import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { AllProtocolsEntry } from '~/server/features/scaling/interop/utils/getAllProtocolEntries'
import { getAllProtocolsColumns } from './columns'

export function AllProtocolsTable({
  hideTypeColumn,
  entries,
  showAverageInFlightValueColumn,
}: {
  entries: AllProtocolsEntry[]
  hideTypeColumn?: boolean
  showAverageInFlightValueColumn?: boolean
}) {
  const columns = useMemo(
    () =>
      getAllProtocolsColumns(hideTypeColumn, showAverageInFlightValueColumn),
    [hideTypeColumn, showAverageInFlightValueColumn],
  )

  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
