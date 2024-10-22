'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTable } from '~/hooks/use-table'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { useScalingAssociatedTokensContext } from '../../../_components/scaling-associated-tokens-context'
import { toTableRows } from '../../_utils/to-table-rows'
import { scalingTvlColumns } from './columns'

interface Props {
  entries: ScalingTvlEntry[]
  rollups?: boolean
}

export function ScalingTvlTable({ entries, rollups }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()

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
    columns: scalingTvlColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: rollups ? getStageSortedRowModel() : getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return rollups ? (
    <RollupsTable table={table} />
  ) : (
    <BasicTable table={table} insideMainPageCard />
  )
}
