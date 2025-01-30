import type { ColumnHelper } from '@tanstack/react-table'
import type { CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import { ProjectNameCell } from '../../cells/project-name-cell'
import type { CommonProjectColumnsOptions } from './common-project-columns'
import { getCommonProjectColumns } from './common-project-columns'

export function getBridgesCommonProjectColumns<T extends CommonProjectEntry>(
  columnHelper: ColumnHelper<T>,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    ...getCommonProjectColumns(columnHelper, opts),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
    }),
  ]
}
