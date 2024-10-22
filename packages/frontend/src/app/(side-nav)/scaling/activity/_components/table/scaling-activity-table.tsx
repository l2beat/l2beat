'use client'

import {
  type RowModel,
  type Table,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { getScalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
  rollups?: boolean
  customSortedRowModel?: (
    table: Table<ScalingActivityEntry>,
  ) => () => RowModel<ScalingActivityEntry>
}

export function ScalingActivityTable({
  entries,
  rollups,
  customSortedRowModel,
}: Props) {
  const filter = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(filter),
    [entries, filter],
  )

  const table = useTable({
    columns: getScalingActivityColumns({
      customActivityIndexing: !!customSortedRowModel,
    }),
    data: filteredEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: customSortedRowModel ?? getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayUops', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })
  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}
