import type { ColumnHelper } from '@tanstack/react-table'
import type {
  CommonProjectColumnsEntry,
  CommonProjectColumnsOptions,
} from './common-project-columns'
import { getCommonProjectColumns } from './common-project-columns'

export function getDaCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  opts?: CommonProjectColumnsOptions,
) {
  return [...getCommonProjectColumns(columnHelper, opts)] as const
}
