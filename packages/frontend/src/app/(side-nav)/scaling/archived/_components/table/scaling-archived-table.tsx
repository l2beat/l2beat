'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { scalingArchivedColumns } from './columns'

interface Props {
  entries: ScalingArchivedEntry[]
}

export function ScalingArchivedTable({ entries }: Props) {

  const archivedTable = useTable({
    data: entries,
    columns: scalingArchivedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })
  return <BasicTable table={archivedTable} />
}
