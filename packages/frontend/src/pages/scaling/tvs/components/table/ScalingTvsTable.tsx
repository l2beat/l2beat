import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { api } from '~/trpc/React'
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
  const { display } = useTvsDisplayControlsContext()
  const { sorting, setSorting } = useTableSorting()

  const { data: sevenDayBreakdown, isLoading: isTvsLoading } =
    api.tvs.table.useQuery({
      type: tab,
      excludeAssociatedTokens: display.excludeAssociatedTokens,
      excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
    })

  const data = useMemo(
    () =>
      toTableRows({
        projects: entries,
        sevenDayBreakdown,
      }),
    [entries, sevenDayBreakdown],
  )

  const columns = useMemo(
    () =>
      getScalingTvsColumns({
        ignoreUnderReviewIcon,
        breakdownType,
        excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
        isTvsLoading,
      }),
    [breakdownType, ignoreUnderReviewIcon, display, isTvsLoading],
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
      <BasicTable table={table} />
    </>
  )
}
