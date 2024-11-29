'use client'

import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import { BasicTable } from '~/components/table/basic-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { useTable } from '~/hooks/use-table'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { toTableRows } from '../../_utils/to-table-rows'
import { scalingSummaryOthersColumns } from './columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryOthersTable({ entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const { sorting, setSorting } = useTableSorting()

  const tableEntries = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeAssociatedTokens,
      }),
    [entries, excludeAssociatedTokens],
  )

  const table = useTable({
    data: tableEntries,
    columns: scalingSummaryOthersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getStageSortedRowModel(),
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
