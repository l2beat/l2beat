import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import { compareActivityEntry } from '~/server/features/layer2s/activity/utils/compareActivityEntry'
import type { ActivityMetric } from '../ActivityMetricContext'
import { useActivityMetricContext } from '../ActivityMetricContext'
import { getL2ActivityColumns } from './columns'

interface Props {
  entries: L2ActivityEntry[]
}

export function L2ActivityTable({ entries }: Props) {
  const { metric } = useActivityMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(() => {
    const tableEntries = entries
      .sort((a, b) => compareActivityEntry(a, b, { metric }))
      .map((e) => mapToTableEntry(e, metric))
    return tableEntries ?? []
  }, [entries, metric])

  const columns = useMemo(() => getL2ActivityColumns(metric), [metric])

  const table = useTable({
    columns,
    data: tableEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

function mapToTableEntry(entry: L2ActivityEntry, metric: ActivityMetric) {
  return {
    ...entry,
    data: entry.data
      ? {
          ...entry.data,
          pastDayCount: entry.data[metric].pastDayCount,
          summedCount: entry.data[metric].summedCount,
          maxCount: entry.data[metric].maxCount,
          totalCount: metric === 'tps' ? entry.data.tps.totalCount : undefined,
        }
      : undefined,
  }
}
