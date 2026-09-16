import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { L2RiskDaEntry } from '~/server/features/layer2s/risks/data-availability/getL2RiskDaEntries'
import { getL2RiskDataAvailabilityColumns } from './columns'

interface Props {
  entries: L2RiskDaEntry[]
  hideType?: boolean
}

export function L2RiskDaTable({ entries, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const columns = useMemo(
    () => getL2RiskDataAvailabilityColumns(hideType),
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
