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
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import {
  scalingRiskStateValidationOptimisticColumns,
  scalingRiskStateValidationValidityColumns,
} from './columns'

export function ScalingRiskStateValidationTable({
  tableTab,
  setTableTab,
  validity,
  optimistic,
}: {
  tableTab: 'validity' | 'optimistic'
  setTableTab: (tab: 'validity' | 'optimistic') => void
  validity: ScalingRiskStateValidationValidityEntry[]
  optimistic: ScalingRiskStateValidationOptimisticEntry[]
}) {
  return (
    <Tabs
      name="riskStateValidaitonTableTab"
      value={tableTab}
      onValueChange={(value) => setTableTab(value as 'validity' | 'optimistic')}
      variant="highlighted"
    >
      <TabsList>
        <TabsTrigger value="validity">
          Validity
          <CountBadge className="group-data-[state=active]/tabs-trigger:bg-primary-invert group-data-[state=active]/tabs-trigger:text-brand">
            {validity.length}
          </CountBadge>
        </TabsTrigger>
        <TabsTrigger value="optimistic">
          Optimistic
          <CountBadge className="group-data-[state=active]/tabs-trigger:bg-primary-invert group-data-[state=active]/tabs-trigger:text-brand">
            {optimistic.length}
          </CountBadge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="validity">
        <ScalingRiskValidityTable entries={validity} />
      </TabsContent>
      <TabsContent value="optimistic">
        <ScalingRiskOptimisticTable entries={optimistic} />
      </TabsContent>
    </Tabs>
  )
}

export function ScalingRiskValidityTable({
  entries,
}: {
  entries: ScalingRiskStateValidationValidityEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: scalingRiskStateValidationValidityColumns,
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
