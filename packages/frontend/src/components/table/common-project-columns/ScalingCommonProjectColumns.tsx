import type { ColumnHelper } from '@tanstack/react-table'
import { TableLink } from '~/components/table/TableLink'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { ProjectNameCell } from '../cells/ProjectNameCell'
import type { CommonProjectColumnsOptions } from './CommonProjectColumns'
import { getCommonProjectColumns } from './CommonProjectColumns'

export function getScalingCommonProjectColumns<T extends CommonProjectEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    ...getCommonProjectColumns(columnHelper, getHref),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => (
        <TableLink href={getHref(ctx.row.original)}>
          <ProjectNameCell
            project={ctx.row.original}
            withInfoTooltip
            ignoreUnderReviewIcon={opts?.ignoreUnderReviewIcon}
          />
        </TableLink>
      ),
      enableHiding: false,
    }),
  ]
}
