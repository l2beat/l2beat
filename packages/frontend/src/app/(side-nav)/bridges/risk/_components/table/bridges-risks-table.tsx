'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { bridgesRisksColumns } from './columns'

import type { BridgesRiskEntry } from '~/server/features/bridges/get-bridges-risk-entries'
import { useBridgesFilter } from '../../../_components/bridges-filter-context'
import { BridgesFilters } from '../../../_components/bridges-filters'

export interface Props {
  entries: BridgesRiskEntry[]
}

export function BridgesRiskTable({ entries }: Props) {
  const includeFilters = useBridgesFilter()

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )

  const table = useTable({
    data: filteredEntries,
    columns: bridgesRisksColumns,
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
      <BridgesFilters entries={filteredEntries} />
      <BasicTable table={table} />
    </div>
  )
}
