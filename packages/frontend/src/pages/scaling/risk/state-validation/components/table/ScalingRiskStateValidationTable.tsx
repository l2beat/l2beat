import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { CountBadge } from '~/components/badge/CountBadge'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
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
  tableTab,
  setTableTab,
  zk,
  optimistic,
}: {
  tableTab: 'zk' | 'optimistic'
  setTableTab: (tab: 'zk' | 'optimistic') => void
  zk: ScalingRiskStateValidationZkEntry[]
  optimistic: ScalingRiskStateValidationOptimisticEntry[]
}) {
  return (
    <div>
      <RadioGroup
        name="riskStateValidaitonTableTab"
        value={tableTab}
        onValueChange={(value) => setTableTab(value as 'zk' | 'optimistic')}
        className="mb-2 h-10 w-full p-1.5"
      >
        <RadioGroupItem
          value="zk"
          className="flex w-full items-center justify-center gap-1.5"
        >
          Zero-knowledge
          <CountBadge>{zk.length}</CountBadge>
        </RadioGroupItem>
        <RadioGroupItem
          value="optimistic"
          className="flex w-full items-center justify-center gap-1.5"
        >
          Optimistic
          <CountBadge>{optimistic.length}</CountBadge>
        </RadioGroupItem>
      </RadioGroup>
      {tableTab === 'zk' && <ScalingRiskZkTable entries={zk} />}
      {tableTab === 'optimistic' && (
        <ScalingRiskOptimisticTable entries={optimistic} />
      )}
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
