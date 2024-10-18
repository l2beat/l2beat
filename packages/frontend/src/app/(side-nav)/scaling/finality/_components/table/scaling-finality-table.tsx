'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTable } from '~/hooks/use-table'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { scalingFinalityColumns } from './columns'

export function ScalingFinalityTable({
  entries,
  rollups,
}: { entries: ScalingFinalityEntry[]; rollups?: boolean }) {
  const table = useTable({
    data: entries,
    columns: scalingFinalityColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: rollups ? getStageSortedRowModel() : getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: '#',
          desc: false,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}
