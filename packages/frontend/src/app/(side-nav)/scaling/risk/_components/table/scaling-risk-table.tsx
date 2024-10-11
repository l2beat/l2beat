'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { ScalingFilters } from '../../../_components/scaling-filters'
import { scalingRiskColumns } from './columns'

export function ScalingRiskTable({ entries }: { entries: ScalingRiskEntry[] }) {
  const includeFilters = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter((item) => includeFilters(item)),
    [entries, includeFilters],
  )

  const table = useTable({
    data: filteredEntries,
    columns: scalingRiskColumns,
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
    <div className="space-y-3 md:space-y-6">
      <ScalingFilters items={filteredEntries} />
      <BasicTable table={table} />
    </div>
  )
}
