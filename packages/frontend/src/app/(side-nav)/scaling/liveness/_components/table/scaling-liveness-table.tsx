'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import type { ScalingLivenessEntry } from 'rewrite/src/server/features/scaling/liveness/get-scaling-liveness-entries'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { useTable } from '~/hooks/use-table'
import { useLivenessTimeRangeContext } from '../liveness-time-range-context'
import { columns } from './columns'
import { toLivenessTableEntry } from './to-table-entry'

export interface Props {
  entries: ScalingLivenessEntry[]
  rollups?: boolean
}

export function ScalingLivenessTable({ entries, rollups }: Props) {
  const { timeRange } = useLivenessTimeRangeContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(
    () => entries.map((item) => toLivenessTableEntry(item, timeRange)),
    [entries, timeRange],
  )

  const table = useTable({
    data: tableEntries,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}
