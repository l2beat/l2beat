'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { scalingUpcomingColumns } from './columns'

interface Props {
  entries: ScalingUpcomingEntry[]
}

export function ScalingUpcomingTable({ entries }: Props) {
  const upcomingTable = useTable({
    data: entries,
    columns: scalingUpcomingColumns,
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
  return (
    <BasicTable table={upcomingTable} insideMainPageCard />
  )
}
