import { createColumnHelper } from '@tanstack/react-table'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
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
  columnHelper.accessor('proofSystem', {
    header: 'Proof system',
    cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
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
