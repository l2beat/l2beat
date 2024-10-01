'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { useScalingAssociatedTokensContext } from '../../_components/scaling-associated-tokens-context'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../_components/scaling-tvl-filters'
import { toTableRows } from '../_utils/to-table-rows'
import { scalingLayer2sColumns } from './table/columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryTable({ entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const includeFilters = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )

  const tableEntries = useMemo(
    () =>
      toTableRows({
        projects: filteredEntries,
        excludeAssociatedTokens,
      }),
    [filteredEntries, excludeAssociatedTokens],
  )

  const table = useTable({
    data: tableEntries,
    columns: scalingLayer2sColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <div className="space-y-3 md:space-y-6">
      <ScalingTvlFilters items={filteredEntries} />
      <BasicTable table={table} />
    </div>
  )
}
