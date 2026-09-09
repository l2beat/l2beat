import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type {
  L2RiskStateValidationNoProofsEntry,
  L2RiskStateValidationOptimisticEntry,
  L2RiskStateValidationValidityEntry,
} from '~/server/features/layer2s/risks/state-validation/getL2RiskStateValidationEntries'
import {
  l2RiskStateValidationNoProofsColumns,
  l2RiskStateValidationOptimisticColumns,
  l2RiskStateValidationValidityColumns,
} from './columns'

export function L2RiskValidityTable({
  entries,
}: {
  entries: L2RiskStateValidationValidityEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: l2RiskStateValidationValidityColumns,
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

export function L2RiskOptimisticTable({
  entries,
}: {
  entries: L2RiskStateValidationOptimisticEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: l2RiskStateValidationOptimisticColumns,
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

export function L2RiskNoProofsTable({
  entries,
}: {
  entries: L2RiskStateValidationNoProofsEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: l2RiskStateValidationNoProofsColumns,
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
