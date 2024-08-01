'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { ScalingDaFilters } from '../scaling-da-filters'
import { columns } from './columns'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/get-scaling-da-entries'

export interface Props {
  items: ScalingDataAvailabilityEntry[]
}

export function ScalingDataAvailabilityTable({ items }: Props) {
  const includeFilters = useScalingFilter()

  const projects = useMemo(
    () => items.filter((item) => includeFilters(item)),
    [items, includeFilters],
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
    },
  })

  return (
    <section className="space-y-6">
      <ScalingDaFilters items={projects} />
      <BasicTable table={table} />
    </section>
  )
}
