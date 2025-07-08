import { createColumnHelper } from '@tanstack/react-table'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/TypeInfo'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/getScalingUpcomingEntries'

const columnHelper = createColumnHelper<ScalingUpcomingEntry>()

export const scalingUpcomingColumns = [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}`,
  ),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeInfo stacks={ctx.row.original.stacks}>{ctx.getValue()}</TypeInfo>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
  }),
  columnHelper.display({
    header: 'Purpose',
    cell: (ctx) => ctx.row.original.purposes.join(', '),
  }),
]
