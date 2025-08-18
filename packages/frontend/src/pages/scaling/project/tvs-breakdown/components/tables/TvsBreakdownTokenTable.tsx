import { getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { TvsBreakdownTokenEntry } from '~/server/features/scaling/tvs/breakdown/getProjectTokensEntries'
import { columns } from './columns/columns'
import { renderFormulaSubComponent } from './FormulaSubRow'

interface Props {
  entries: TokenRow[]
}

export type TokenRow = TvsBreakdownTokenEntry & BasicTableRow

export function TvsBreakdownTokenTable(props: Props) {
  const table = useTable({
    sortDescFirst: true,
    data: props.entries,
    columns,
    getRowCanExpand: (row) => !!row.original.formula,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <BasicTable table={table} renderSubComponent={renderFormulaSubComponent} />
  )
}
