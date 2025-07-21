import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import { useScalingAssociatedTokensContext } from '~/pages/scaling/components/ScalingAssociatedTokensContext'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { toTableRows } from '../../utils/toTableRows'
import { scalingSummaryColumns } from './columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryRollupsTable({ entries }: Props) {
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
    columns: scalingSummaryColumns,
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

  return <RollupsTable table={table} />
}
