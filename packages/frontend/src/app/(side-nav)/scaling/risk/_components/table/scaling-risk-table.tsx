'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { scalingRiskColumns } from './columns'

export function ScalingRiskTable({
  entries,
  rollups,
}: { entries: ScalingRiskEntry[]; rollups?: boolean }) {
  const table = useTable({
    data: entries,
    columns: scalingRiskColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
