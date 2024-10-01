'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BaseScalingFilters } from '~/app/(side-nav)/scaling/_components/base-scaling-filters'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/types'
import { scalingFinalityColumns } from './columns'

export function ScalingFinalityTable({
  projects,
}: { projects: ScalingFinalityEntry[] }) {
  const includeFilters = useScalingFilter()

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
    <div className="space-y-3 md:space-y-6">
      <BaseScalingFilters items={filteredProjects} />
      <BasicTable table={table} />
    </div>
  )
}
