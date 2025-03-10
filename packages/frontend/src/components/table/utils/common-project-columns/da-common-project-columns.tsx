import type { ColumnHelper } from '@tanstack/react-table'
import type {
  CommonProjectColumnsEntry,
  CommonProjectColumnsOptions,
} from './common-project-columns'
import { getCommonProjectColumns } from './common-project-columns'

export function getDaCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string,
  opts?: CommonProjectColumnsOptions,
) {
  return [...getCommonProjectColumns(columnHelper, getHref, opts)] as const
}
