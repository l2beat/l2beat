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
import type { ProjectTvsBreakdownTokenEntry } from '~/server/features/scaling/tvs/breakdown/getProjectTokensEntries'
import { columns } from './columns'
import { renderFormulaSubComponent } from './FormulaSubRow'

interface Props {
  entries: TokenRow[]
}

export type TokenRow = ProjectTvsBreakdownTokenEntry & BasicTableRow

export function ProjectTvsBreakdownTokenTable(props: Props) {
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
    /**
     * Row id is needed for the expanded row model to preserve the expanded state
     * When no getRowId is provided, the id is the index of the row by default
     * And the state is kept as a mapping between the id and the expanded state
     * So if you expand the first row and filter the table, the first row will be expanded
     */
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: 'value', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <div id="tvs-breakdown-token-table" className="space-y-4">
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
