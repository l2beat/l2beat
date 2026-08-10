import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingRiskDaEntry } from '~/server/features/scaling/risks/data-availability/getScalingRiskDaEntries'
import { getScalingRiskDataAvailabilityColumns } from './columns'

interface Props {
  entries: ScalingRiskDaEntry[]
  hideType?: boolean
}

export function ScalingRiskDaTable({ entries, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const columns = useMemo(
    () => getScalingRiskDataAvailabilityColumns(hideType),
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
