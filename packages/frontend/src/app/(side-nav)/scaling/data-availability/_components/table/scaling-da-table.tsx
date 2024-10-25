'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTable } from '~/hooks/use-table'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { columns } from './columns'

export interface Props {
  entries: ScalingDataAvailabilityEntry[]
  rollups?: boolean
}

export function ScalingDataAvailabilityTable({ entries, rollups }: Props) {
  const table = useTable({
    data: entries,
    columns: columns,
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
