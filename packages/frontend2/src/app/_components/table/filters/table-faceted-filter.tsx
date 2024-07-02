import { assert } from '@l2beat/shared-pure'
import { type Column } from '@tanstack/react-table'
import { TableFilter } from './table-filter'

interface TableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined
  title: string
}

export function TableFacetedFilter<TData, TValue>({
  column,
  title,
}: TableFacetedFilterProps<TData, TValue>) {
  assert(
    column !== undefined,
    'Column cannot be undefined, probably used a wrong ID',
  )
  const facets = column.getFacetedUniqueValues() as Map<string, number>
  const options = Array.from(facets.keys()).map((value) => ({
    label: value,
    value,
  }))
  const selected = column.getFilterValue() as string

  return (
    <TableFilter
      title={title}
      options={options}
      value={selected}
      onValueChange={column.setFilterValue}
    />
  )
}
