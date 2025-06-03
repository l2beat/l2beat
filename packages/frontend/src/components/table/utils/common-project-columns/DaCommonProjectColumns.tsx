import type { ColumnHelper } from '@tanstack/react-table'
import type {
  CommonProjectColumnsEntry,
  CommonProjectColumnsOptions,
} from './CommonProjectColumns'
import { getCommonProjectColumns } from './CommonProjectColumns'

export function getDaCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string,
  opts?: CommonProjectColumnsOptions,
) {
  return [...getCommonProjectColumns(columnHelper, getHref, opts)] as const
}
