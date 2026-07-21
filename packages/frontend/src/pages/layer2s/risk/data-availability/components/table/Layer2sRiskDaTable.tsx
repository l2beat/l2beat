import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { Layer2sRiskDaEntry } from '~/server/features/layer2s/risks/data-availability/getLayer2sRiskDaEntries'
import { getLayer2sRiskDataAvailabilityColumns } from './columns'

interface Props {
  entries: Layer2sRiskDaEntry[]
  hideType?: boolean
}

export function Layer2sRiskDaTable({ entries, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const columns = useMemo(
    () => getLayer2sRiskDataAvailabilityColumns(hideType),
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
