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
import { getL2SummaryOthersColumns } from './columns'
import type { L2SummaryTableProps } from './L2SummaryTableProps'

export function L2SummaryOthersTable({
  entries,
  isLoading,
  skeletonCount,
}: L2SummaryTableProps) {
  const trpc = useTRPC()
  const { sorting, setSorting } = useTableSorting()
  const { display } = useTvsDisplayControlsContext()

  const { data, isLoading: isTvsLoading } = useQuery(
    trpc.tvs.table.queryOptions({
      type: 'others',
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
    () => getL2SummaryOthersColumns({ isTvsLoading }),
    [isTvsLoading],
  )

  const table = useTable('L2SummaryOthersTable', {
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
