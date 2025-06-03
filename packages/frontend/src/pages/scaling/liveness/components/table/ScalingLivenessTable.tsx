import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import { useLivenessTimeRangeContext } from '../LivenessTimeRangeContext'
import { columns } from './Columns'
import { toLivenessTableEntry } from './toTableEntry'

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
