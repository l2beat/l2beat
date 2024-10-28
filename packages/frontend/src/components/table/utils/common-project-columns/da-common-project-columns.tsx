import { type ColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '../../cells/project-name-cell'
import {
  type CommonProjectColumnsEntry,
  type CommonProjectColumnsOptions,
  getCommonProjectColumns,
} from './common-project-columns'

export function getDaCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    ...getCommonProjectColumns(columnHelper, opts),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      header: 'DA Layer',
      meta: {
        tooltip:
          'The data availability layer where the data (transaction data or state diffs) is posted.',
      },
      sortDescFirst: false,
      cell: (ctx) => (
        <ProjectNameCell
          project={{
            name: ctx.getValue(),
          }}
        />
      ),
    }),
  ]
}
