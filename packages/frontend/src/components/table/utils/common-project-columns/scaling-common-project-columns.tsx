import { ProjectId } from '@l2beat/shared-pure'
import type { ColumnHelper } from '@tanstack/react-table'
import { TableLink } from '~/components/table/table-link'
import type { CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import { ProjectNameCell } from '../../cells/project-name-cell'
import type { CommonProjectColumnsOptions } from './common-project-columns'
import { getCommonProjectColumns } from './common-project-columns'

export function getScalingCommonProjectColumns<T extends CommonProjectEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string | undefined,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    ...getCommonProjectColumns(columnHelper, getHref, opts),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => {
        const projectName = (
          <ProjectNameCell project={ctx.row.original} withInfoTooltip />
        )

        if (ctx.row.original.id === ProjectId.ETHEREUM) {
          return projectName
        }
        return (
          <TableLink href={getHref(ctx.row.original)}>{projectName}</TableLink>
        )
      },
      meta: opts?.activity
        ? {
            headClassName: 'w-0 min-w-[154px]',
          }
        : undefined,
    }),
  ]
}
