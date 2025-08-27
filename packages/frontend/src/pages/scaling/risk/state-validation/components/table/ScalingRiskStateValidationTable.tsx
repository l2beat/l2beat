import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type {
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationZkEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import {
  scalingRiskStateValidationColumns,
  scalingRiskStateValidationOptimisticColumns,
} from './columns'

export function ScalingRiskStateValidationTable({
  zk,
  optimistic,
}: {
  zk: ScalingRiskStateValidationZkEntry[]
  optimistic: ScalingRiskStateValidationOptimisticEntry[]
}) {
  return (
    <div>
      <h1 className="font-bold text-2xl">ZK</h1>
      <ScalingRiskZkTable entries={zk} />
      <h1 className="font-bold text-2xl">Optimistic</h1>
      <ScalingRiskOptimisticTable entries={optimistic} />
    </div>
  )
}

export function ScalingRiskZkTable({
  entries,
}: {
  entries: ScalingRiskStateValidationZkEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: scalingRiskStateValidationColumns,
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

  return <BasicTable table={table} />
}

export function ScalingRiskOptimisticTable({
  entries,
}: {
  entries: ScalingRiskStateValidationOptimisticEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: scalingRiskStateValidationOptimisticColumns,
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

  return <BasicTable table={table} />
}
