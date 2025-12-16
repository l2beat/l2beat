import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { api } from '~/trpc/React'
import { useScalingAssociatedTokensContext } from '../../../components/ScalingAssociatedTokensContext'
import { toTableRows } from '../../utils/ToTableRows'
import { getScalingTvsColumns } from './columns'

interface Props {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed'
  entries: ScalingTvsEntry[]
  breakdownType: 'bridgeType' | 'assetCategory'
  ignoreUnderReviewIcon?: boolean
}

export function ScalingTvsTable({
  tab,
  entries,
  breakdownType,
  ignoreUnderReviewIcon,
}: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { sorting, setSorting } = useTableSorting()

  const { data: sevenDayBreakdown, isLoading: isTvsLoading } =
    api.tvs.table.useQuery({
      type: tab,
      excludeAssociatedTokens,
      excludeRwaRestrictedTokens: !includeRwaRestrictedTokens,
    })

  const data = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeAssociatedTokens,
        sevenDayBreakdown,
      }),
    [entries, excludeAssociatedTokens, sevenDayBreakdown],
  )

  const columns = useMemo(
    () =>
      getScalingTvsColumns({
        ignoreUnderReviewIcon,
        breakdownType,
        excludeRwaRestrictedTokens: !includeRwaRestrictedTokens,
        isTvsLoading,
      }),
    [
      breakdownType,
      ignoreUnderReviewIcon,
      includeRwaRestrictedTokens,
      isTvsLoading,
    ],
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
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} insideMainPageCard />
    </>
  )
}
