'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { bridgesArchivedOthersColumns, bridgesArchivedSingleChainColumns } from './columns'

export interface Props {
  entries: BridgesArchivedEntry[]
  isOthers?: boolean
}

export function BridgesArchivedTable({ entries, isOthers }: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
  )

  const activeTable = useTable({
    data: filteredEntries,
    columns: isOthers
      ? bridgesArchivedOthersColumns
      : bridgesArchivedSingleChainColumns,
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

  return <BasicTable table={activeTable} />
}
