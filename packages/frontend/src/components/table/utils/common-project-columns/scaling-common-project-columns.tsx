import type { ColumnHelper } from '@tanstack/react-table'
import { TableCellLink } from '~/app/(side-nav)/scaling/summary/_components/table/table-cell-link'
import type { CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import { ProjectNameCell } from '../../cells/project-name-cell'
import type { CommonProjectColumnsOptions } from './common-project-columns'
import { getCommonProjectColumns } from './common-project-columns'

export function getScalingCommonProjectColumns<T extends CommonProjectEntry>(
  columnHelper: ColumnHelper<T>,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    ...getCommonProjectColumns(columnHelper, opts),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => {
        const nameCell = (
          <ProjectNameCell project={ctx.row.original} withInfoTooltip />
        )

        if (opts?.summary) {
          return (
            <TableCellLink href={`/scaling/projects/${ctx.row.original.slug}`}>
              {nameCell}
            </TableCellLink>
          )
        }

        return nameCell
      },
      meta: opts?.activity
        ? {
            headClassName: 'w-0 min-w-[154px]',
          }
        : undefined,
    }),
  ]
}
