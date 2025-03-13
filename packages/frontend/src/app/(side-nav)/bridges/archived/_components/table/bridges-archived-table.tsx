'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import { NewTableFilters } from '~/components/table/filters/new-table-filters'
import { useIncludeFilters } from '~/components/table/filters/use-include-filters'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { bridgesArchivedColumns } from './columns'

export interface Props {
  entries: BridgesArchivedEntry[]
}

export function BridgesArchivedTable({ entries }: Props) {
  const includeFilters = useIncludeFilters()

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
      <NewTableFilters entries={entries} />
      <BasicTable table={activeTable} />
    </div>
  )
}
