import type {
  ColumnDef,
  FilterFn,
  RowData,
  TableOptions,
} from '@tanstack/react-table'

export const scalarSelectFilter: FilterFn<unknown> = (
  row,
  columnId,
  filterValue,
) => {
  const rowValue = row.getValue(columnId)

  if (Array.isArray(filterValue)) {
    return filterValue.some((value) => rowValue === value)
  }

  return rowValue === filterValue
}

scalarSelectFilter.autoRemove = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

export function withFilterDefaults<TData extends RowData>(
  columns: TableOptions<TData>['columns'],
): TableOptions<TData>['columns'] {
  return columns.map((column) => {
    const filterMeta = column.meta?.filter
    if (!filterMeta || column.filterFn !== undefined) {
      return column
    }
    if (filterMeta.kind === 'select') {
      return { ...column, filterFn: 'scalarSelect' } as ColumnDef<
        TData,
        unknown
      >
    }
    return column
  })
}
