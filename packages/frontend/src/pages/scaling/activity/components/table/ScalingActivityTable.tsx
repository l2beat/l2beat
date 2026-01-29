import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { compareActivityEntry } from '~/server/features/scaling/activity/utils/compareActivityEntry'
import type { ActivityMetric } from '../ActivityMetricContext'
import { useActivityMetricContext } from '../ActivityMetricContext'
import { getScalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
  notReviewed?: boolean
}

export function ScalingActivityTable({ entries, notReviewed }: Props) {
  const { metric } = useActivityMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(() => {
    const tableEntries = entries
      .sort((a, b) => compareActivityEntry(a, b, { metric }))
      .map((e) => mapToTableEntry(e, metric))
    return tableEntries ?? []
  }, [entries, metric])

  const columns = useMemo(
    () =>
      getScalingActivityColumns(metric, {
        ignoreUnderReviewIcon: notReviewed,
      }),
    [metric, notReviewed],
  )

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

function mapToTableEntry(entry: ScalingActivityEntry, metric: ActivityMetric) {
  return {
    ...entry,
    data: entry.data
      ? {
          ...entry.data,
          pastDayCount: entry.data[metric].pastDayCount,
          summedCount: entry.data[metric].summedCount,
          maxCount: entry.data[metric].maxCount,
        }
      : undefined,
  }
}
