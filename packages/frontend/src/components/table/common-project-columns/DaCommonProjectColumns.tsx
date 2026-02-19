import type { ColumnHelper } from '@tanstack/react-table'
import type { CommonProjectColumnsEntry } from './CommonProjectColumns'
import { getCommonProjectColumns } from './CommonProjectColumns'

export function getDaCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string,
) {
  return [...getCommonProjectColumns(columnHelper, getHref)] as const
}
