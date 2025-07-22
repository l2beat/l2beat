import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { useScalingAssociatedTokensContext } from '../../../components/ScalingAssociatedTokensContext'
import { toTableRows } from '../../utils/ToTableRows'
import { getScalingTvsColumns } from './columns'

interface Props {
  entries: ScalingTvsEntry[]
  rollups?: boolean
  notReviewed?: boolean
}

export function ScalingTvsTable({ entries, rollups, notReviewed }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const { sorting, setSorting } = useTableSorting()

  const allProjects = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeAssociatedTokens,
      }),
    [entries, excludeAssociatedTokens],
  )

  const table = useTable({
    data: allProjects,
    columns: getScalingTvsColumns({ ignoreUnderReviewIcon: true }),
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

  return rollups ? (
    <RollupsTable table={table} />
  ) : (
    <BasicTable
      table={table}
      insideMainPageCard
      rowColoringMode={notReviewed ? 'ignore-colors' : undefined}
    />
  )
}
