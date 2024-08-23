'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { scalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
}

export function ScalingActivityTable({ entries }: Props) {
  const table = useTable({
    columns: scalingActivityColumns,
    data: entries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayTps', desc: true }],
    },
  })

  return <BasicTable table={table} />
}
