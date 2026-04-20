import type { ColumnHelper } from '@tanstack/react-table'
import { TableLink } from '~/components/table/TableLink'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
  ProjectNameMobileStatusIcons,
} from '../cells/ProjectNameCell'
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
        <div className="flex items-center gap-1.5 md:contents">
          <ProjectNameInfoTooltip project={ctx.row.original}>
            <TableLink href={getHref(ctx.row.original)}>
              <ProjectNameCell
                project={ctx.row.original}
                withInfoTooltip
                ignoreUnderReviewIcon={opts?.ignoreUnderReviewIcon}
              />
            </TableLink>
          </ProjectNameInfoTooltip>
          <ProjectNameMobileStatusIcons
            className="shrink-0 md:hidden"
            project={ctx.row.original}
            ignoreUnderReviewIcon={opts?.ignoreUnderReviewIcon}
          />
        </div>
      ),
      enableHiding: false,
    }),
  ]
}
