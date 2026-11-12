import { assert } from '@l2beat/shared-pure'
import type { Header, SortDirection } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { cn } from '~/utils/cn'
import { SortingArrows } from './SortingArrows'

export function ValueAndChangeSortingHeader<TData>({
  header,
  compact,
}: {
  header: Header<TData, unknown>
  /**
   * For a compact table: the change's label in the 52px box of the change
   * below it (`PercentChange` `compact`), after the cell's 4px gap, so both
   * labels end where their figures end.
   */
  compact?: boolean
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

  const headerDef = changeHeaderInstance.column.columnDef.header
  assert(
    typeof headerDef === 'function',
    'Expected change-sort header to be a function',
  )
  const changeHeader = headerDef(changeHeaderInstance.getContext())
  assert(
    typeof changeHeader === 'string',
    'Expected change-sort header to render a string',
  )

  // A table can have several change columns, all called e.g. "7D%".
  const valueHeaderDef = header.column.columnDef.header
  const changeLabel =
    typeof valueHeaderDef === 'string'
      ? `${valueHeaderDef} ${changeHeader}`
      : undefined

  return (
    <div className={cn('flex items-end', compact ? 'gap-1' : 'gap-2')}>
      {valueSortingArrows}
      <span className={cn(compact && 'inline-flex w-[52px] justify-end')}>
        <SortingArrows
          direction={changeColumn.getIsSorted()}
          nextDirection={changeColumn.getNextSortingOrder()}
          onClick={changeColumn.getToggleSortingHandler()}
          aria-label={changeLabel}
        >
          {changeHeader}
        </SortingArrows>
      </span>
    </div>
  )
}

/**
 * For the header cell's `aria-sort`. The cell holds the change companion's
 * sort control too, so sorting by the change sorts by this cell as well.
 * Only the primary sort is announced: a Shift-click adds secondary sorts, and
 * ARIA allows one sorted header at a time.
 */
export function getHeaderAriaSort<TData>(header: Header<TData, unknown>) {
  if (!header.column.getCanSort()) {
    return undefined
  }
  const changeSortColumnId = header.column.columnDef.meta?.changeSortColumnId
  const changeColumn = changeSortColumnId
    ? header.getContext().table.getColumn(changeSortColumnId)
    : undefined
  const primary = [header.column, changeColumn].find(
    (column) => column?.getSortIndex() === 0,
  )
  return toAriaSort(primary?.getIsSorted() ?? false)
}

function toAriaSort(direction: false | SortDirection) {
  switch (direction) {
    case 'asc':
      return 'ascending'
    case 'desc':
      return 'descending'
    case false:
      return 'none'
  }
}
