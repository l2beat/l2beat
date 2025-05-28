'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import type { BridgesArchivedEntry } from 'rewrite/src/server/features/bridges/get-bridges-archived-entries'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { getBridgesArchivedColumns } from './columns'

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
    columns: getBridgesArchivedColumns(isOthers),
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
