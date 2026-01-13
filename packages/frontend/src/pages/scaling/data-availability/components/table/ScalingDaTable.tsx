import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/getScalingDaEntries'
import { getScalingDataAvailabilityColumns } from './columns'

interface Props {
  entries: ScalingDaEntry[]
  hideType?: boolean
}

export function ScalingDaTable({ entries, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const columns = useMemo(
    () => getScalingDataAvailabilityColumns(hideType),
    [hideType],
  )

  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}
