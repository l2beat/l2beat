import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { useTable } from '~/hooks/useTable'
import type { TvsBreakdownTokenEntry } from '~/server/features/scaling/tvs/breakdown/getProjectTokensEntries'
import { columns } from './columns'
import { renderFormulaSubComponent } from './FormulaSubRow'

interface Props {
  entries: TokenRow[]
}

export type TokenRow = TvsBreakdownTokenEntry & BasicTableRow

export function TvsBreakdownTokenTable(props: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => props.entries.filter(filterEntries),
    [props.entries, filterEntries],
  )

  const table = useTable({
    sortDescFirst: true,
    data: filteredEntries,
    columns,
    getRowCanExpand: (row) => !!row.original.formula,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      sorting: [{ id: 'value', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <div className="space-y-4">
      <TableFilters entries={props.entries} />
      <PrimaryCard>
        <BasicTable
          table={table}
          renderSubComponent={renderFormulaSubComponent}
        />
      </PrimaryCard>
    </div>
  )
}
