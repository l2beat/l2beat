'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { useTable } from '~/hooks/use-table'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { compareActivityEntry } from '~/server/features/scaling/activity/utils/compare-activity-entry'
import type { ActivityMetric } from '../activity-metric-context'
import { useActivityMetricContext } from '../activity-metric-context'
import { getScalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
  rollups?: boolean
}

export function ScalingActivityTable({ entries, rollups }: Props) {
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
  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
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
