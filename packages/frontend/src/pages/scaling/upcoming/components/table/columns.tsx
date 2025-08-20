import { createColumnHelper } from '@tanstack/react-table'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TypeInfo } from '~/components/table/cells/TypeInfo'
import { TableLink } from '~/components/table/TableLink'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/getScalingUpcomingEntries'

const columnHelper = createColumnHelper<ScalingUpcomingEntry>()

export const scalingUpcomingColumns = [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}`,
  ),
  columnHelper.accessor('proofSystem', {
    header: 'Proof system',
    cell: (ctx) => (
      <TableLink
        href={
          ctx.getValue()?.zkCatalogId
            ? `/zk-catalog?highlight=${ctx.getValue()?.zkCatalogId}`
            : undefined
        }
      >
        <TwoRowCell>
          <TwoRowCell.First>
            <TypeInfo stacks={ctx.row.original.stacks}>
              {ctx.getValue()?.type}
            </TypeInfo>
          </TwoRowCell.First>
          {ctx.getValue()?.name && (
            <TwoRowCell.Second>{ctx.getValue()?.name}</TwoRowCell.Second>
          )}
        </TwoRowCell>
      </TableLink>
    ),
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
    },
  }),
  columnHelper.display({
    header: 'Purpose',
    cell: (ctx) => ctx.row.original.purposes.join(', '),
  }),
]
