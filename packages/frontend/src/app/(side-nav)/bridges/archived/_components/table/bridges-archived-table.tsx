'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { bridgesArchivedColumns } from './columns'

export interface Props {
  entries: BridgesArchivedEntry[]
}

export function BridgesArchivedTable({ entries }: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
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
      <TableFilters entries={entries} />
      <BasicTable table={activeTable} />
    </div>
  )
}
