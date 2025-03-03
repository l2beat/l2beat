import type { ColumnHelper } from '@tanstack/react-table'
import { DesktopTableCellLink } from '~/app/(side-nav)/scaling/summary/_components/table/desktop-table-cell-link'
import type { CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import { ProjectNameCell } from '../../cells/project-name-cell'
import type { CommonProjectColumnsOptions } from './common-project-columns'
import { getCommonProjectColumns } from './common-project-columns'

export function getBridgesCommonProjectColumns<T extends CommonProjectEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    ...getCommonProjectColumns(columnHelper, opts),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => (
        <DesktopTableCellLink href={getHref(ctx.row.original)}>
          <ProjectNameCell project={ctx.row.original} />
        </DesktopTableCellLink>
      ),
    }),
  ]
}
