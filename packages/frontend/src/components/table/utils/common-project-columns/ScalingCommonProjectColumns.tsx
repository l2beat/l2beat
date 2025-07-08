import { ProjectId } from '@l2beat/shared-pure'
import type { ColumnHelper } from '@tanstack/react-table'
import { TableLink } from '~/components/table/TableLink'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ProjectNameCell } from '../../cells/ProjectNameCell'
import type { CommonProjectColumnsOptions } from './CommonProjectColumns'
import { getCommonProjectColumns } from './CommonProjectColumns'

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
          <ProjectNameCell
            project={ctx.row.original}
            withInfoTooltip
            ignoreUnderReviewIcon={opts?.ignoreUnderReviewIcon}
          />
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
