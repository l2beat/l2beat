import { createColumnHelper } from '@tanstack/react-table'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/type-info'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'

const columnHelper = createColumnHelper<ScalingUpcomingEntry>()

export const scalingUpcomingColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeInfo stack={ctx.row.original.stack}>{ctx.getValue()}</TypeInfo>
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
