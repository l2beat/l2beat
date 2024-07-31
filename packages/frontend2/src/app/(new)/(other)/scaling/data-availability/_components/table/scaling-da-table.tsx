'use client'
import { notUndefined } from '@l2beat/shared-pure'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/types'
import { ScalingDaFilters } from '../scaling-da-filters'
import { columns } from './columns'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'

export interface Props {
  items: ScalingDataAvailabilityEntry[]
}

export function ScalingDataAvailabilityTable({ items }: Props) {
  const filters = useScalingFilter()

  const includeFilters = useCallback(
    (entry: ScalingDataAvailabilityEntry) => {
      const checks = [
        filters.rollupsOnly !== false
          ? entry.category.includes('Rollup')
          : undefined,
        filters.category !== undefined
          ? entry.category === filters.category
          : undefined,
        filters.stack !== undefined
          ? entry.provider === filters.stack
          : undefined,
        filters.stage !== undefined
          ? entry.type === 'layer2'
            ? entry.stage?.stage === filters.stage
            : false
          : undefined,
        filters.purpose !== undefined
          ? entry.purposes.some((purpose) => purpose === filters.purpose)
          : undefined,
        filters.daLayer !== undefined
          ? entry.dataAvailability.layer.value === filters.daLayer
          : undefined,
      ].filter(notUndefined)

      return checks.length === 0 || checks.every(Boolean)
    },
    [filters],
  )

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
