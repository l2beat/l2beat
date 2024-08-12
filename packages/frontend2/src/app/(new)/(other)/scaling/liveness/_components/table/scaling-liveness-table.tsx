'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { columns } from './columns'
import { type ScalingLivenessEntry } from '~/server/features/scaling/get-scaling-liveness-entries'
import { BaseScalingFilters } from '~/app/(new)/(other)/_components/base-scaling-filters'
import { toLivenessTableEntry } from './to-table-entry'
import { type LivenessTimeRange } from '~/server/features/liveness/types'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { LivenessTimeRangeControls } from '../liveness-time-range-controls'

export interface Props {
  entries: ScalingLivenessEntry[]
}

export function ScalingLivenessTable({ entries }: Props) {
  const [timeRange, setTimeRange] = useLocalStorage<LivenessTimeRange>(
    'liveness-time-range',
    '30d',
  )
  const includeFilters = useScalingFilter()

  const tableEntries = useMemo(
    () =>
      entries
        .filter(includeFilters)
        .map((item) => toLivenessTableEntry(item, timeRange)),
    [entries, includeFilters, timeRange],
  )

  const table = useTable({
    data: tableEntries,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: '#',
          desc: false,
        },
      ],
    },
  })

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <BaseScalingFilters items={entries} />
        <LivenessTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>
      <BasicTable table={table} />
    </section>
  )
}
