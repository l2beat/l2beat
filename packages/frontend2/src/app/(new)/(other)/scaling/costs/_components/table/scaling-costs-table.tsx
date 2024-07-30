'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { scalingCostsColumns } from './columns'
import { type ScalingCostsEntry } from '~/server/features/scaling/get-scaling-costs-entries'
import { type ScalingFiltersState } from '~/app/(new)/(other)/_components/scaling-filters'
import { useCallback, useMemo, useState } from 'react'
import { notUndefined } from '@l2beat/shared-pure'
import { BaseScalingFilters } from '~/app/(new)/(other)/_components/base-scaling-filters'
import { CostsTypeControls } from '../costs-type-controls'

interface Props {
  entries: ScalingCostsEntry[]
}

const DEFAULT_SCALING_FILTERS = {
  rollupsOnly: false,
  category: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
  hostChain: undefined,
}

export function ScalingCostsTable({ entries }: Props) {
  const [scalingFilters, setScalingFilters] = useState<ScalingFiltersState>(
    DEFAULT_SCALING_FILTERS,
  )

  const includeFilters = useCallback(
    (entry: ScalingCostsEntry) => {
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
          ? entry.stage?.stage === scalingFilters.stage
          : undefined,
        scalingFilters.purpose !== undefined
          ? entry.purposes.some((purpose) => purpose === scalingFilters.purpose)
          : undefined,
      ].filter(notUndefined)

      return checks.length === 0 || checks.every(Boolean)
    },
    [scalingFilters],
  )

  const filteredEntries = useMemo(
    () => entries.filter((item) => includeFilters(item)),
    [entries, includeFilters],
  )

  const table = useTable({
    data: filteredEntries,
    columns: scalingCostsColumns,
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
    <div className="space-y-2">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <BaseScalingFilters
          items={filteredEntries}
          state={scalingFilters}
          setState={setScalingFilters}
          showRollupsOnly={false}
        />
        <CostsTypeControls />
      </div>
      <BasicTable
        table={table}
        onResetFilters={() => {
          return
        }}
      />
    </div>
  )
}
