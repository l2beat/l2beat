import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { useScalingAssociatedTokensContext } from '../../../components/ScalingAssociatedTokensContext'
import { toTableRows } from '../../utils/ToTableRows'
import { getScalingTvsColumns } from './columns'

interface Props {
  entries: ScalingTvsEntry[]
  notReviewed?: boolean
  breakdownType: 'bridgeType' | 'assetCategory'
}

export function ScalingTvsTable({
  entries,

  notReviewed,
  breakdownType,
}: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const { sorting, setSorting } = useTableSorting()

  const data = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeAssociatedTokens,
      }),
    [entries, excludeAssociatedTokens],
  )

  const columns = useMemo(
    () =>
      getScalingTvsColumns({
        ignoreUnderReviewIcon: true,
        breakdownType,
      }),
    [breakdownType],
  )

  const table = useTable({
    data,
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
    <BasicTable
      table={table}
      insideMainPageCard
      rowColoringMode={notReviewed ? 'ignore-colors' : undefined}
    />
  )
}
