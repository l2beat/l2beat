import { getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { BaseAssetBreakdownData } from '~/server/features/scaling/tvs/breakdown/types'
import { columns } from './columns/columns'
import { renderFormulaSubComponent } from './FormulaSubRow'

interface Props {
  tokens: TokenRow[]
}

export type TokenRow = BaseAssetBreakdownData & BasicTableRow

export function TvsBreakdownTokenTable(props: Props) {
  const table = useTable({
    sortDescFirst: true,
    data: props.tokens,
    columns,
    getRowCanExpand: (row) => !!row.original.formula,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <BasicTable table={table} renderSubComponent={renderFormulaSubComponent} />
  )
}
