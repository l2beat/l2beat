import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { Layer2sActivityEntry } from '~/server/features/layer2s/activity/getLayer2sActivityEntries'
import { compareActivityEntry } from '~/server/features/layer2s/activity/utils/compareActivityEntry'
import type { ActivityMetric } from '../ActivityMetricContext'
import { useActivityMetricContext } from '../ActivityMetricContext'
import { getLayer2sActivityColumns } from './columns'

interface Props {
  entries: Layer2sActivityEntry[]
}

export function Layer2sActivityTable({ entries }: Props) {
  const { metric } = useActivityMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(() => {
    const tableEntries = entries
      .sort((a, b) => compareActivityEntry(a, b, { metric }))
      .map((e) => mapToTableEntry(e, metric))
    return tableEntries ?? []
  }, [entries, metric])

  const columns = useMemo(() => getLayer2sActivityColumns(metric), [metric])

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

function mapToTableEntry(entry: Layer2sActivityEntry, metric: ActivityMetric) {
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
