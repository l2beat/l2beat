import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { L2TvsEntry } from '~/server/features/layer2s/tvs/getL2TvsEntries'
import { useTRPC } from '~/trpc/React'
import { toTableRows } from '../../utils/toTableRows'
import { getL2TvsColumns } from './columns'

interface Props {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
  entries: L2TvsEntry[]
  breakdownType: 'bridgeType' | 'assetCategory'
}

export function L2TvsTable({ tab, entries, breakdownType }: Props) {
  const trpc = useTRPC()
  const { display } = useTvsDisplayControlsContext()
  const { sorting, setSorting } = useTableSorting()

  const { data, isLoading: isTvsLoading } = useQuery(
    trpc.tvs.table.queryOptions({
      type: tab,
      excludeAssociatedTokens: display.excludeAssociatedTokens,
      excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
    }),
  )

  const tableRows = useMemo(
    () =>
      toTableRows({
        entries,
        data: data?.projects,
      }),
    [entries, data],
  )

  const columns = useMemo(
    () =>
      getL2TvsColumns({
        breakdownType,
        excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
        isTvsLoading,
      }),
    [breakdownType, display, isTvsLoading],
  )

  const table = useTable({
    data: tableRows,
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
