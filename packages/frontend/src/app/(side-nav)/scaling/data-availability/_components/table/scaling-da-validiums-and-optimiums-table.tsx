'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { ScalingDaFilters } from '../scaling-da-filters'
import { columns } from './columns'

export interface Props {
  entries: ScalingDataAvailabilityEntry[]
}

export function ScalingDaValidiumsAndOptimiumsTable({ entries }: Props) {
  const includeFilters = useScalingFilter()

  const projects = useMemo(
    () => entries.filter((item) => includeFilters(item)),
    [entries, includeFilters],
  )

  const table = useTable({
    data: projects,
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
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <section className="space-y-3 md:space-y-6">
      <ScalingDaFilters items={projects} />
      <BasicTable table={table} />
    </section>
  )
}
