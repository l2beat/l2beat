'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { scalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
}

export function ScalingActivityTable({ entries }: Props) {
  const filter = useScalingFilter()

  const filteredEntries = useMemo(
    () => entries.filter(filter),
    [entries, filter],
  )

  const table = useTable({
    columns: scalingActivityColumns,
    data: filteredEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayTps', desc: true }],
    },
  })

  return <BasicTable table={table} />
}
