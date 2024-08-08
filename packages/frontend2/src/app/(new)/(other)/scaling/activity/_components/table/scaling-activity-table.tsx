'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { api } from '~/trpc/react'
import { useActivityTimeRangeContext } from '../activity-time-range-context'
import {
  type ScalingActivityTableEntry,
  scalingActivityColumns,
} from './columns'

export function ScalingActivityTable({
  entries,
}: {
  entries: ScalingActivityEntry[]
}) {
  const { timeRange } = useActivityTimeRangeContext()
  const { data, isLoading } = api.scaling.activity.table.useQuery({ timeRange })

  const tableEntries: ScalingActivityTableEntry[] = useMemo(
    () =>
      entries
        .map<ScalingActivityTableEntry>((entry) => {
          if (!data || isLoading) {
            return {
              ...entry,
              data: {
                type: 'not-available',
                reason: 'loading',
              },
            }
          }
          const projectData = data[entry.id]
          if (!projectData) {
            return {
              ...entry,
              data: {
                type: 'not-available',
                reason: 'missing-data',
              },
            }
          }
          return {
            ...entry,
            data: {
              type: 'available',
              ...projectData,
            },
          }
        })
        .sort((a, b) => {
          if (
            a.data.type === 'not-available' &&
            b.data.type === 'not-available'
          ) {
            return 0
          }
          if (a.data.type === 'not-available') {
            return 1
          }
          if (b.data.type === 'not-available') {
            return -1
          }

          return b.data.pastDayTps - a.data.pastDayTps
        }),
    [data, entries, isLoading],
  )

  const table = useTable({
    columns: scalingActivityColumns,
    data: tableEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayTps', desc: true }],
    },
  })

  return <BasicTable table={table} />
}
