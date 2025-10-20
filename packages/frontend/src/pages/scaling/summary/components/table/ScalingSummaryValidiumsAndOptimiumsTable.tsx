import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import { useScalingAssociatedTokensContext } from '~/pages/scaling/components/ScalingAssociatedTokensContext'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { api } from '~/trpc/React'
import { toTableRows } from '../../utils/toTableRows'
import { getScalingSummaryValidiumAndOptimiumsColumns } from './columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryValidiumsAndOptimiumsTable({ entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { sorting, setSorting } = useTableSorting()

  const { data, isLoading } = api.tvs.table.useQuery({
    type: 'validiumsAndOptimiums',
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

  const table = useTable({
    data: tableEntries,
    columns: getScalingSummaryValidiumAndOptimiumsColumns({
      isTvsLoading: isLoading,
    }),
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

  return <BasicTable table={table} />
}
