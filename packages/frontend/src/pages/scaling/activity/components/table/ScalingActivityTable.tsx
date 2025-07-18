import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { compareActivityEntry } from '~/server/features/scaling/activity/utils/compareActivityEntry'
import type { ActivityMetric } from '../ActivityMetricContext'
import { useActivityMetricContext } from '../ActivityMetricContext'
import { getScalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
  rollups?: boolean
  notReviewed?: boolean
}

export function ScalingActivityTable({ entries, rollups, notReviewed }: Props) {
  const { metric } = useActivityMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(() => {
    const tableEntries = entries
      .sort((a, b) => compareActivityEntry(a, b, { metric }))
      .map((e) => mapToTableEntry(e, metric))
    return tableEntries ?? []
  }, [entries, metric])

  const table = useTable({
    columns: getScalingActivityColumns(metric, {
      activity: true,
      ignoreUnderReviewIcon: notReviewed,
    }),
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
  return rollups ? (
    <RollupsTable table={table} />
  ) : (
    <BasicTable
      table={table}
      rowColoringMode={notReviewed ? 'ignore-colors' : undefined}
    />
  )
}

function mapToTableEntry(entry: ScalingActivityEntry, metric: ActivityMetric) {
  return {
    ...entry,
    data: entry.data
      ? {
          ...entry.data,
          change: entry.data[metric].change,
          pastDayCount: entry.data[metric].pastDayCount,
          summedCount: entry.data[metric].summedCount,
          maxCount: entry.data[metric].maxCount,
        }
      : undefined,
  }
}
