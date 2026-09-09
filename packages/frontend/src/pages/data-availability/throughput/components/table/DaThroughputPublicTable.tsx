import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTable } from '~/hooks/useTable'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { useIncludeL2Only } from '../DaThroughputContext'
import type { DaThroughputTableData } from './columns'
import { publicSystemsColumns } from './columns'

interface Props {
  items: DaThroughputEntry[]
}

export function DaThroughputPublicTable({ items }: Props) {
  const { includeL2Only } = useIncludeL2Only()

  const tableEntries = useMemo(
    () => items.map((item) => toTableEntry(item, includeL2Only)),
    [items, includeL2Only],
  )

  const table = useTable({
    columns: publicSystemsColumns,
    data: tableEntries,
    initialState: {
      sorting: [{ id: 'pastDayAvgThroughputPerSecond', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}

function toTableEntry(
  entry: DaThroughputEntry,
  includeL2Only: boolean,
): DaThroughputTableData {
  const data = includeL2Only ? entry.l2OnlyData : entry.data
  const syncWarning = data?.syncWarning

  return {
    ...entry,
    data,
    statuses: {
      ...entry.statuses,
      syncWarning,
    },
    isSynced: !syncWarning,
  }
}
