'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BaseScalingFilters } from '~/app/(new)/(other)/_components/base-scaling-filters'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { useLivenessTimeRangeContext } from '../liveness-time-range-context'
import { LivenessTimeRangeControls } from '../liveness-time-range-controls'
import { columns } from './columns'
import { toLivenessTableEntry } from './to-table-entry'

export interface Props {
  entries: ScalingLivenessEntry[]
}

export function ScalingLivenessTable({ entries }: Props) {
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
    <section className="mt-4 space-y-6 sm:mt-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <BaseScalingFilters items={filteredEntries} />
        <LivenessTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>
      <BasicTable table={table} />
    </section>
  )
}
