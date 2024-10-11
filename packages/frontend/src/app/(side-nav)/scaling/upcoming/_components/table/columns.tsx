import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'

const columnHelper = createColumnHelper<ScalingUpcomingEntry>()

export const scalingUpcomingColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('stateValidation', {
    header: 'Proof system',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} colorful={false} />,
    enableSorting: false,
  }),
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
  }),
]
