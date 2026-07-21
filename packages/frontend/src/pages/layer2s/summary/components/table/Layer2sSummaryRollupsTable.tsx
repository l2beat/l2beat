import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { Layer2sSummaryEntry } from '~/server/features/layer2s/summary/getLayer2sSummaryEntries'
import { useTRPC } from '~/trpc/React'
import { toTableRows } from '../../utils/toTableRows'
import { getLayer2sSummaryColumns } from './columns'

interface Props {
  entries: Layer2sSummaryEntry[]
}

export function Layer2sSummaryRollupsTable({ entries }: Props) {
  const trpc = useTRPC()
  const { display } = useTvsDisplayControlsContext()
  const { sorting, setSorting } = useTableSorting()

  const { data, isLoading } = useQuery(
    trpc.tvs.table.queryOptions({
      type: 'rollups',
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
    () => getLayer2sSummaryColumns({ isTvsLoading: isLoading }),
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
