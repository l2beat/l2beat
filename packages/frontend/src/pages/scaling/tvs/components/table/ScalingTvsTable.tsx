import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useDisplayControlsContext } from '~/components/table/display/DisplayControlsContext'
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
  const { getDisplay } = useDisplayControlsContext()
  const { sorting, setSorting } = useTableSorting()

  const { data: sevenDayBreakdown, isLoading: isTvsLoading } =
    api.tvs.table.useQuery({
      type: tab,
      excludeAssociatedTokens: getDisplay('excludeAssociatedTokens'),
      excludeRwaRestrictedTokens: getDisplay('excludeRwaRestrictedTokens'),
    })

  const data = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeAssociatedTokens: getDisplay('excludeAssociatedTokens'),
        sevenDayBreakdown,
      }),
    [entries, getDisplay, sevenDayBreakdown],
  )

  const columns = useMemo(
    () =>
      getScalingTvsColumns({
        ignoreUnderReviewIcon,
        breakdownType,
        excludeRwaRestrictedTokens: getDisplay('excludeRwaRestrictedTokens'),
        isTvsLoading,
      }),
    [breakdownType, ignoreUnderReviewIcon, getDisplay, isTvsLoading],
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
