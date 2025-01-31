'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { useBridgesFilter } from '../../../_components/bridges-filter-context'
import { BridgesFilters } from '../../../_components/bridges-filters'
import { bridgesArchivedColumns } from './columns'

export interface Props {
  entries: BridgesArchivedEntry[]
}

export function BridgesArchivedTable({ entries }: Props) {
  const includeFilters = useBridgesFilter()

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )

  const activeTable = useTable({
    data: filteredEntries,
    columns: bridgesArchivedColumns,
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
      <BridgesFilters entries={filteredEntries} />
      <BasicTable table={activeTable} />
    </div>
  )
}
