'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '../../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../../_components/scaling-tvl-filters'
import { toTableRows } from '../_utils/to-table-rows'
import { scalingTvlCokumns } from './table/columns'

interface Props {
  projects: ScalingTvlEntry[]
}

export function ScalingTvlTable({ projects }: Props) {
  const { excludeAssociatedTokens } = useScalingFilterValues()
  const includeFilters = useScalingFilter()

  const allProjects = useMemo(
    () =>
      toTableRows({
        projects: projects.filter(includeFilters),
        excludeAssociatedTokens,
      }),
    [projects, includeFilters, excludeAssociatedTokens],
  )

  const table = useTable({
    data: allProjects,
    columns: scalingTvlCokumns,
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
    <div className="space-y-2">
      <ScalingTvlFilters items={projects} />
      <BasicTable table={table} />
    </div>
  )
}
