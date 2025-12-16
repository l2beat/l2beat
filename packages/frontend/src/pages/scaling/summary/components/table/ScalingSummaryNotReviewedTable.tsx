import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useDisplayControlsContext } from '~/components/table/display/DisplayControlsContext'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { api } from '~/trpc/React'
import { toTableRows } from '../../utils/toTableRows'
import { getScalingSummaryNotReviewedColumns } from './columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryNotReviewedTable({ entries }: Props) {
  const { getDisplay } = useDisplayControlsContext()
  const { sorting, setSorting } = useTableSorting()

  const { data, isLoading } = api.tvs.table.useQuery({
    type: 'notReviewed',
    excludeAssociatedTokens: getDisplay('excludeAssociatedTokens'),
    excludeRwaRestrictedTokens: getDisplay('excludeRwaRestrictedTokens'),
  })

  const tableEntries = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeAssociatedTokens: getDisplay('excludeAssociatedTokens'),
        sevenDayBreakdown: data,
      }),
    [entries, getDisplay, data],
  )

  const columns = useMemo(
    () => getScalingSummaryNotReviewedColumns({ isTvsLoading: isLoading }),
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
