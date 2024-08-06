'use client'

import { getCoreRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { scalingActivityColumns } from './columns'

export function ScalingActivityTable({
  entries,
}: { entries: ScalingActivityEntry[] }) {
  const entriesWithData = entries.map((entry) => ({
    ...entry,
    data: {},
  }))

  const table = useTable({
    columns: scalingActivityColumns,
    data: entriesWithData,
    getCoreRowModel: getCoreRowModel(),
  })

  return <BasicTable table={table} />
}
