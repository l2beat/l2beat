'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { useScalingAssociatedTokensContext } from '../../_components/scaling-associated-tokens-context'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../_components/scaling-tvl-filters'
import { toTableRows } from '../_utils/to-table-rows'
import { scalingTvlColumns } from './table/columns'

interface Props {
  entries: ScalingTvlEntry[]
}

export function ScalingTvlTable({ entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const includeFilters = useScalingFilter()

  const allProjects = useMemo(
    () =>
      toTableRows({
        projects: entries.filter(includeFilters),
        excludeAssociatedTokens,
      }),
    [entries, includeFilters, excludeAssociatedTokens],
  )

  const table = useTable({
    data: allProjects,
    columns: scalingTvlColumns,
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
    <div className="space-y-5 md:space-y-7">
      <ScalingTvlFilters items={allProjects} />
      <BasicTable table={table} />
    </div>
  )
}
