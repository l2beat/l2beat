import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { Layer2sLivenessEntry } from '~/server/features/layer2s/liveness/getLayer2sLivenessEntries'
import { useLivenessTimeRangeContext } from '../LivenessTimeRangeContext'
import { getLayer2sLivenessColumns } from './columns'
import { toLivenessTableEntry } from './toTableEntry'

interface Props {
  entries: Layer2sLivenessEntry[]
  hideType?: boolean
}

export function Layer2sLivenessTable({ entries, hideType }: Props) {
  const { timeRange } = useLivenessTimeRangeContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(
    () => entries.map((item) => toLivenessTableEntry(item, timeRange)),
    [entries, timeRange],
  )

  const columns = useMemo(() => getLayer2sLivenessColumns(hideType), [hideType])

  const table = useTable({
    data: tableEntries,
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
