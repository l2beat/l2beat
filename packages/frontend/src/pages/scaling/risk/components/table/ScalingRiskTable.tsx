import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/getScalingRiskEntries'
import { getScalingRiskColumns } from './columns'

export function ScalingRiskTable({
  entries,
  rollups,
  notReviewed,
}: {
  entries: ScalingRiskEntry[]
  rollups?: boolean
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

  return rollups ? (
    <RollupsTable table={table} />
  ) : (
    <BasicTable
      table={table}
      rowColoringMode={notReviewed ? 'ignore-colors' : undefined}
    />
  )
}
