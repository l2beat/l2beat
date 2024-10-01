'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { useScalingFilter } from '../../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../../_components/scaling-upcoming-and-archived-filters'
import { scalingArchivedColumns } from './columns'

interface Props {
  entries: ScalingArchivedEntry[]
}

export function ScalingArchivedTable({ entries }: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )
  const archivedTable = useTable({
    data: filteredEntries,
    columns: scalingArchivedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })
  return (
    <section className="space-y-3 md:space-y-6">
      <ScalingUpcomingAndArchivedFilters items={filteredEntries} />
      <BasicTable table={archivedTable} />
    </section>
  )
}
