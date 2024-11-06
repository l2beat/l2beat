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

  const tableEntries = useMemo(() => {
    const tableEntries = entries.map((e) => mapToTableEntry(e, metric))
    return tableEntries ?? []
  }, [entries, metric])

  const table = useTable({
    columns: getScalingActivityColumns(metric, {
      activity: !!customSortedRowModel,
    }),
    data: tableEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: customSortedRowModel ?? getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayCount', desc: true }],
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
