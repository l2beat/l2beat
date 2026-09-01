import { assert } from '@l2beat/shared-pure'
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
  if (!changeSortColumnId) {
    return valueSortingArrows
  }

  const changeColumn = header.getContext().table.getColumn(changeSortColumnId)
  assert(changeColumn, 'Expected change-sort companion column')

  if (!changeColumn.getCanSort()) {
    return valueSortingArrows
  }

  const changeHeaderInstance = header.headerGroup.headers.find(
    (candidate) => candidate.column.id === changeSortColumnId,
  )
  assert(
    changeHeaderInstance,
    'Expected change-sort companion header in the same group',
  )

  const changeHeader = flexRender(
    changeHeaderInstance.column.columnDef.header,
    changeHeaderInstance.getContext(),
  )
  assert(
    typeof changeHeader === 'string',
    'Expected change-sort header to render a string',
  )

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
