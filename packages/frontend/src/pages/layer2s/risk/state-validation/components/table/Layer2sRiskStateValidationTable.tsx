import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type {
  Layer2sRiskStateValidationNoProofsEntry,
  Layer2sRiskStateValidationOptimisticEntry,
  Layer2sRiskStateValidationValidityEntry,
} from '~/server/features/layer2s/risks/state-validation/getLayer2sRiskStateValidationEntries'
import {
  layer2sRiskStateValidationNoProofsColumns,
  layer2sRiskStateValidationOptimisticColumns,
  layer2sRiskStateValidationValidityColumns,
} from './columns'

export function Layer2sRiskValidityTable({
  entries,
}: {
  entries: Layer2sRiskStateValidationValidityEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: layer2sRiskStateValidationValidityColumns,
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

export function Layer2sRiskOptimisticTable({
  entries,
}: {
  entries: Layer2sRiskStateValidationOptimisticEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: layer2sRiskStateValidationOptimisticColumns,
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

export function Layer2sRiskNoProofsTable({
  entries,
}: {
  entries: Layer2sRiskStateValidationNoProofsEntry[]
}) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: layer2sRiskStateValidationNoProofsColumns,
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
