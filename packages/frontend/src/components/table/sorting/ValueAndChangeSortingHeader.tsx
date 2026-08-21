import type { Header } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { SortingArrows } from './SortingArrows'

export function ValueAndChangeSortingHeader<TData>({
  header,
}: {
  header: Header<TData, unknown>
}) {
  const valueHeader = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  )

  if (!header.column.getCanSort()) {
    return valueHeader
  }

  const valueSortingArrows = (
    <SortingArrows
      direction={header.column.getIsSorted()}
      nextDirection={header.column.getNextSortingOrder()}
      onClick={header.column.getToggleSortingHandler()}
    >
      {valueHeader}
    </SortingArrows>
  )

  const changeSortColumnId = header.column.columnDef.meta?.changeSortColumnId
  const changeColumn = changeSortColumnId
    ? header.getContext().table.getColumn(changeSortColumnId)
    : undefined

  if (!changeColumn?.getCanSort()) {
    return valueSortingArrows
  }

  const changeHeader =
    typeof changeColumn.columnDef.header === 'string'
      ? changeColumn.columnDef.header
      : undefined

  if (!changeHeader) {
    return valueSortingArrows
  }

  return (
    <div className="flex items-end gap-2">
      {valueSortingArrows}
      <SortingArrows
        direction={changeColumn.getIsSorted()}
        nextDirection={changeColumn.getNextSortingOrder()}
        onClick={changeColumn.getToggleSortingHandler()}
      >
        {changeHeader}
      </SortingArrows>
    </div>
  )
}
