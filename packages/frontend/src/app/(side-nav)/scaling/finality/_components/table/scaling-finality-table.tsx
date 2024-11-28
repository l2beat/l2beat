'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { useTable } from '~/hooks/use-table'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { scalingFinalityColumns } from './columns'

export interface Props {
  entries: ScalingFinalityEntry[]
  rollups?: boolean
}

export function ScalingFinalityTable({ entries, rollups }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const table = useTable({
    data: entries,
    columns: scalingFinalityColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: rollups ? getStageSortedRowModel() : getSortedRowModel(),
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
