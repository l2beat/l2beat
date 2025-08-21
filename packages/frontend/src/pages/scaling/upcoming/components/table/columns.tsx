import { createColumnHelper } from '@tanstack/react-table'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/TypeInfo'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { MissingIcon } from '~/icons/Missing'
import { SatisfiedIcon } from '~/icons/Satisfied'
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
      <div className="font-medium">
        <TypeInfo stacks={ctx.row.original.stacks}>{ctx.getValue()}</TypeInfo>
      </div>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip />,
      cellClassName: 'pr-5',
    },
  }),
  columnHelper.display({
    header: 'Purpose',
    cell: (ctx) => ctx.row.original.purposes.join(', '),
  }),
  columnHelper.accessor('hasTestnet', {
    header: 'Has testnet?',
    cell: (ctx) =>
      ctx.getValue() ? (
        <SatisfiedIcon className="ml-auto size-5" />
      ) : (
        <MissingIcon className="ml-auto size-5" />
      ),
    meta: {
      align: 'right',
    },
  }),
]
