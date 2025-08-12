import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/getScalingRiskEntries'
import { getScalingRiskColumns } from './columns'

export function ScalingRiskTable({
  entries,
  notReviewed,
}: {
  entries: ScalingRiskEntry[]
  notReviewed?: boolean
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: getScalingRiskColumns({ ignoreUnderReviewIcon: true }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <BasicTable
      table={table}
      rowColoringMode={notReviewed ? 'ignore-colors' : undefined}
    />
  )
}
