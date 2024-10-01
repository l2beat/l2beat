'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { ScalingFilters } from '~/app/(side-nav)/scaling/_components/scaling-filters'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { scalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
}

export function ScalingActivityTable({ entries }: Props) {
  const filter = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(filter),
    [entries, filter],
  )

  const table = useTable({
    columns: scalingActivityColumns,
    data: filteredEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayTps', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })
  return (
    <div className="space-y-3 md:space-y-6">
      <ScalingFilters showRollupsOnly items={filteredEntries} />
      <BasicTable table={table} />
    </div>
  )
}
