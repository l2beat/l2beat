import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import { useScalingAssociatedTokensContext } from '~/pages/scaling/components/ScalingAssociatedTokensContext'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { api } from '~/trpc/React'
import { toTableRows } from '../../utils/toTableRows'
import { getScalingSummaryOthersColumns } from './columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryOthersTable({ entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { sorting, setSorting } = useTableSorting()

  const { data, isLoading } = api.tvs.table.useQuery({
    type: 'others',
    excludeAssociatedTokens,
    includeRwaRestrictedTokens,
  })

  const tableEntries = useMemo(
    () =>
      toTableRows({
        projects: entries,
        sevenDayBreakdown: data,
        excludeAssociatedTokens,
      }),
    [entries, excludeAssociatedTokens, data],
  )

  const columns = useMemo(
    () => getScalingSummaryOthersColumns({ isTvsLoading: isLoading }),
    [isLoading],
  )

  const table = useTable({
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
      <BasicTable table={table} />
    </>
  )
}
