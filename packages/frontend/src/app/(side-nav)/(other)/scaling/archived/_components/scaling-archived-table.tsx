'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { toTableRows } from '../../summary/_utils/to-table-rows'
import { scalingArchivedColumns } from './table/columns'

export function ScalingArchivedTable() {
  const archivedProjects = useMemo(
    () =>
      toTableRows({
        projects: [],
      }),
    [],
  )
  const archivedTable = useTable({
    data: archivedProjects,
    columns: scalingArchivedColumns,
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
  return <BasicTable table={archivedTable} />
}
