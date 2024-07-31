/** eslint-disable @typescript-eslint/no-unsafe-assignment */
/** eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { notUndefined } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { BaseScalingFilters } from '~/app/(new)/(other)/_components/base-scaling-filters'
import { type ScalingFiltersState } from '~/app/(new)/(other)/_components/scaling-filters'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingCostsEntry } from '~/server/features/scaling/get-scaling-costs-entries'
import { CostsTypeControls } from '../costs-type-controls'
import { scalingCostsColumns } from './columns'

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

export function ScalingCostsTable(props: Props) {
  const [scalingFilters, setScalingFilters] = useState<ScalingFiltersState>(
    DEFAULT_SCALING_FILTERS,
  )

  const [type, setType] = useState<'total' | 'per-l2-tx'>('total')

  const entries = useMemo(() => calculateDataByType(props.entries, type), [type, props.entries])

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
        <CostsTypeControls value={type} onValueChange={setType} />
      </div>
      <BasicTable
        table={table}
        onResetFilters={() => setScalingFilters(DEFAULT_SCALING_FILTERS)}
      />
    </div>
  )
}

function calculateDataByType(entries: ScalingCostsEntry[], type: 'total' | 'per-l2-tx') {
  if (type === 'total') {
    return entries
  }

  return entries.map(e => {
    if (!e.data?.txCount) return e
    return {
      ...e,
      data: {
        ...e.data,
        total: e.data.total / e.data.txCount,
        blobs: e.data.blobs ? e.data.blobs / e.data.txCount : undefined,
        compute: e.data.compute / e.data.txCount,
        calldata: e.data.calldata / e.data.txCount,
        overhead: e.data.overhead / e.data.txCount,
      }
    }
  })
}