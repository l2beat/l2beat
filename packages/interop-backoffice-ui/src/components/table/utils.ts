import type { ColumnDef, RowData } from '@tanstack/react-table'

export function getLeafColumns<TData extends RowData>(
  columns: ColumnDef<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
  return columns.flatMap((column) => {
    if ('columns' in column && Array.isArray(column.columns)) {
      return getLeafColumns(column.columns)
    }

    return [column]
  })
}

export function getAccessorValue<TData extends RowData, TValue>(
  column: ColumnDef<TData, TValue>,
  row: TData,
  rowIndex: number,
): TValue | undefined {
  if ('accessorFn' in column && typeof column.accessorFn === 'function') {
    return column.accessorFn(row, rowIndex)
  }

  if ('accessorKey' in column && typeof column.accessorKey === 'string') {
    return getValueByAccessorKey(row, column.accessorKey) as TValue | undefined
  }

  return undefined
}

function getValueByAccessorKey(row: unknown, accessorKey: string) {
  let current = row

  for (const part of accessorKey.split('.')) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined
    }

    current = (current as Record<string, unknown>)[part]
  }

  return current
}
