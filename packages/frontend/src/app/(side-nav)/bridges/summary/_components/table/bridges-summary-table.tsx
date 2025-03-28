'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { bridgesSummaryActiveColumns } from './columns'

import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

export interface Props {
  entries: BridgesSummaryEntry[]
}

export function BridgesSummaryTable({ entries }: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
  )

  const activeTable = useTable({
    data: filteredEntries,
    columns: bridgesSummaryActiveColumns,
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
