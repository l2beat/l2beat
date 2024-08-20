'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { useScalingAssociatedTokensContext } from '../../../_components/scaling-associated-tokens-context'
import { useScalingFilter } from '../../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../../_components/scaling-tvl-filters'
import { toTableRows } from '../_utils/to-table-rows'
import { scalingTvlCokumns } from './table/columns'

interface Props {
  projects: ScalingTvlEntry[]
}

export function ScalingTvlTable({ projects }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
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
    <div className="space-y-5 md:space-y-7">
      <ScalingTvlFilters items={allProjects} />
      <BasicTable table={table} />
    </div>
  )
}
