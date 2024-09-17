'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { toTableRows } from '../../summary/_utils/to-table-rows'
import { scalingUpcomingColumns } from './table/columns'

export function ScalingUpcomingTable() {
  const upcomingProjects = useMemo(
    () =>
      toTableRows({
        projects: [],
        excludeAssociatedTokens: false,
      }),
    [],
  )
  const upcomingTable = useTable({
    data: upcomingProjects,
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
  return <BasicTable table={upcomingTable} />
}
