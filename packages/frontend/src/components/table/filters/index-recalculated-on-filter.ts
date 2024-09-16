import { type CellContext } from '@tanstack/react-table'

export function indexRecalculatedOnFilter<T, V>(ctx: CellContext<T, V>) {
  const index = ctx.table
    .getFilteredRowModel()
    .flatRows.findIndex((flatRow) => flatRow.id === ctx.row.id)

  return index === -1 ? 1 : index + 1
}
