'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { scalingCostsColumns } from './columns'
import { type ScalingCostsEntry } from '~/server/features/scaling/get-scaling-costs-entries'

interface Props {
  entries: ScalingCostsEntry[]
}

export function ScalingCostsTable({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns: scalingCostsColumns,
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
    <BasicTable
      table={table}
      onResetFilters={() => {
        return
      }}
    />
  )
}
