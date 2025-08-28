import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { CountBadge } from '~/components/badge/CountBadge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
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
    <Tabs
      // name="riskStateValidaitonTableTab"
      value={tableTab}
      onValueChange={(value) => setTableTab(value as 'zk' | 'optimistic')}
      variant="highlighted"
    >
      <TabsList>
        <TabsTrigger value="zk">
          Zero-knowledge
          <CountBadge className="group-data-[state=active]/tabs-trigger:bg-primary-invert group-data-[state=active]/tabs-trigger:text-brand">
            {zk.length}
          </CountBadge>
        </TabsTrigger>
        <TabsTrigger value="optimistic">
          Optimistic
          <CountBadge className="group-data-[state=active]/tabs-trigger:bg-primary-invert group-data-[state=active]/tabs-trigger:text-brand">
            {optimistic.length}
          </CountBadge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="zk">
        <ScalingRiskZkTable entries={zk} />
      </TabsContent>
      <TabsContent value="optimistic">
        <ScalingRiskOptimisticTable entries={optimistic} />
      </TabsContent>
    </Tabs>
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
