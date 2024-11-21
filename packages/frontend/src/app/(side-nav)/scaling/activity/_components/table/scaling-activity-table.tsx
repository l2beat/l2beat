'use client'

import {
  type RowModel,
  type Table,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { env } from '~/env'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '../activity-metric-context'
import { getScalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
  rollups?: boolean
  customSortedRowModel?: (
    table: Table<ScalingActivityEntry>,
  ) => () => RowModel<ScalingActivityEntry>
}

export function ScalingActivityTable({
  entries,
  rollups,
  customSortedRowModel,
}: Props) {
  const { metric } = useActivityMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(() => {
    const tableEntries = entries
      .map((e) => mapToTableEntry(e, metric))
      .sort((a, b) => {
        return b.data.pastDayCount - a.data.pastDayCount
      })
    return tableEntries ?? []
  }, [entries, metric])

  const table = useTable({
    columns: getScalingActivityColumns(metric, {
      activity:
        !!customSortedRowModel && env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING,
    }),
    data: tableEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: customSortedRowModel ?? getSortedRowModel(),
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
  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}

function mapToTableEntry(entry: ScalingActivityEntry, metric: ActivityMetric) {
  return {
    ...entry,
    data: {
      ...entry.data,
      change: entry.data[metric].change,
      pastDayCount: entry.data[metric].pastDayCount,
      summedCount: entry.data[metric].summedCount,
      maxCount: entry.data[metric].maxCount,
    },
  }
}
