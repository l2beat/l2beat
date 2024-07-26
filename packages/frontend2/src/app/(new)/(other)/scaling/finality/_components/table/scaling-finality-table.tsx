'use client'
import { notUndefined } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import {
  BaseScalingFilters,
  type BaseScalingFiltersState,
} from '~/app/(new)/(other)/_components/base-scaling-filters'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/types'
import { scalingFinalityColumns } from './columns'

const DEFAULT_SCALING_FILTERS = {
  rollupsOnly: undefined, // not used
  category: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
} satisfies BaseScalingFiltersState

export function ScalingFinalityTable({
  projects,
}: { projects: ScalingFinalityEntry[] }) {
  const [filters, setFilters] = useState<BaseScalingFiltersState>(
    DEFAULT_SCALING_FILTERS,
  )

  const includeFilters = useCallback(
    (entry: ScalingFinalityEntry) => {
      const checks = [
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
      ].filter(notUndefined)

      return checks.length === 0 || checks.every(Boolean)
    },
    [filters],
  )

  const filteredProjects = useMemo(
    () => projects.filter((item) => includeFilters(item)),
    [projects, includeFilters],
  )

  const table = useTable({
    data: filteredProjects,
    columns: scalingFinalityColumns,
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
    <div className="space-y-6">
      <BaseScalingFilters
        items={filteredProjects}
        state={filters}
        setState={setFilters}
        showRollupsOnly={false}
      />
      <BasicTable
        table={table}
        onResetFilters={() => setFilters(DEFAULT_SCALING_FILTERS)}
      />
    </div>
  )
}
