'use client'

import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BaseScalingFilters } from '~/app/(side-nav)/scaling/_components/base-scaling-filters'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { RollupsTable } from '~/components/table/rollups-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTable } from '~/hooks/use-table'
import { type ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { useLivenessTimeRangeContext } from '../liveness-time-range-context'
import { LivenessTimeRangeControls } from '../liveness-time-range-controls'
import { columns } from './columns'
import { toLivenessTableEntry } from './to-table-entry'

export interface Props {
  entries: ScalingLivenessEntry[]
}

export function ScalingLivenessRollupsTable({ entries }: Props) {
  const { timeRange, setTimeRange } = useLivenessTimeRangeContext()
  const includeFilters = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )

  const tableEntries = useMemo(
    () => filteredEntries.map((item) => toLivenessTableEntry(item, timeRange)),
    [filteredEntries, timeRange],
  )

  const table = useTable({
    data: tableEntries,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getStageSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: '#',
          desc: false,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <section className="space-y-3 md:space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <BaseScalingFilters items={filteredEntries} />
        <LivenessTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>
      <RollupsTable table={table} />
    </section>
  )
}
