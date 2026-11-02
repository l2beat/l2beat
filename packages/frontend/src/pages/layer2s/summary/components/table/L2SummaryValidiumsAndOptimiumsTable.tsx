import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import { useTRPC } from '~/trpc/React'
import { toTableRows } from '../../utils/toTableRows'
import { getL2SummaryValidiumAndOptimiumsColumns } from './columns'
import type { L2SummaryTableProps } from './L2SummaryTableProps'

export function L2SummaryValidiumsAndOptimiumsTable({
  entries,
  isLoading,
  skeletonCount,
}: L2SummaryTableProps) {
  const trpc = useTRPC()
  const { display } = useTvsDisplayControlsContext()
  const { sorting, setSorting } = useTableSorting()

  const { data, isLoading: isTvsLoading } = useQuery(
    trpc.tvs.table.queryOptions({
      type: 'validiumsAndOptimiums',
      excludeAssociatedTokens: display.excludeAssociatedTokens,
      excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
    }),
  )

  const tableEntries = useMemo(
    () =>
      toTableRows({
        entries,
        data: data?.projects,
      }),
    [entries, data],
  )

  const columns = useMemo(
    () => getL2SummaryValidiumAndOptimiumsColumns({ isTvsLoading }),
    [isTvsLoading],
  )

  const table = useTable('L2SummaryValidiumsAndOptimiumsTable', {
    data: tableEntries,
    columns,
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
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable
        table={table}
        isLoading={isLoading}
        skeletonCount={skeletonCount}
      />
    </>
  )
}
