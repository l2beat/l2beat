'use client'
import { notUndefined } from '@l2beat/shared-pure'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/types'
import {
  ScalingDaFilters,
  type ScalingDaFiltersState,
} from '../scaling-da-filters'
import { columns } from './columns'

export interface Props {
  items: ScalingDataAvailabilityEntry[]
}

const DEFAULT_SCALING_FILTERS = {
  rollupsOnly: false,
  category: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
  daLayer: undefined,
} satisfies ScalingDaFiltersState

export function ScalingDataAvailabilityTable({ items }: Props) {
  const [scalingFilters, setScalingFilters] = useState<ScalingDaFiltersState>(
    DEFAULT_SCALING_FILTERS,
  )

  const includeFilters = useCallback(
    (entry: ScalingDataAvailabilityEntry) => {
      const checks = [
        scalingFilters.rollupsOnly !== false
          ? entry.category.includes('Rollup')
          : undefined,
        scalingFilters.category !== undefined
          ? entry.category === scalingFilters.category
          : undefined,
        scalingFilters.stack !== undefined
          ? entry.provider === scalingFilters.stack
          : undefined,
        scalingFilters.stage !== undefined
          ? entry.type === 'layer2'
            ? entry.stage?.stage === scalingFilters.stage
            : false
          : undefined,
        scalingFilters.purpose !== undefined
          ? entry.purposes.some((purpose) => purpose === scalingFilters.purpose)
          : undefined,
        scalingFilters.daLayer !== undefined
          ? entry.dataAvailability.layer.value === scalingFilters.daLayer
          : undefined,
      ].filter(notUndefined)

      return checks.length === 0 || checks.every(Boolean)
    },
    [scalingFilters],
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
      <ScalingDaFilters
        items={items}
        state={scalingFilters}
        setState={setScalingFilters}
      />
      <BasicTable
        table={table}
        onResetFilters={() => setScalingFilters(DEFAULT_SCALING_FILTERS)}
      />
    </section>
  )
}
