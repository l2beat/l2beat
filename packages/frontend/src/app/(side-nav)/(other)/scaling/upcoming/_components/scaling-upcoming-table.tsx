'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { useScalingUpcomingFilter } from '../../../_components/scaling-filter-context'
import { ScalingUpcomingFilters } from './scaling-upcoming-filters'
import { scalingUpcomingColumns } from './table/columns'

interface Props {
  entries: ScalingUpcomingEntry[]
}

export function ScalingUpcomingTable({ entries }: Props) {
  const includeFilters = useScalingUpcomingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )
  const upcomingTable = useTable({
    data: filteredEntries,
    columns: scalingUpcomingColumns,
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
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })
  return (
    <section className="mt-4 space-y-6 sm:mt-8">
      <ScalingUpcomingFilters items={filteredEntries} />
      <BasicTable table={upcomingTable} />
    </section>
  )
}
