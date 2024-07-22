'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/types'
import { scalingFinalityColumns } from './columns'

export function ScalingFinalityTable({
  projects,
}: { projects: ScalingFinalityEntry[] }) {
  const table = useTable({
    data: projects,
    columns: scalingFinalityColumns,
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
    <div className="space-y-2">
      <BasicTable table={table} onResetFilters={() => null} />
    </div>
  )
}
