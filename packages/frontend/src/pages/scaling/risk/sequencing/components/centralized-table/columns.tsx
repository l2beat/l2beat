import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { ScalingRiskCentralizedSequencingEntry } from '~/server/features/scaling/risks/sequencing/getScalingRiskSequencingEntries'

const columnHelper = createColumnHelper<ScalingRiskCentralizedSequencingEntry>()

function getSequencingHref(entry: ScalingRiskCentralizedSequencingEntry) {
  return `/scaling/projects/${entry.slug}#sequencing`
}

type CentralizedSequencingTableValueKey =
  | 'trustedPreconfirmation'
  | 'trustedOrdering'
  | 'sequencer'
  | 'realtimeCensorshipResistance'
  | 'forcedInclusion'
  | 'inclusionDelay'
  | 'inclusionMechanics'
  | 'exitDelay'
  | 'exitEconomics'

const tableValueColumns = [
  {
    key: 'trustedPreconfirmation',
    header: 'Trusted\npreconfirmation',
    tooltip:
      'Target latency of the trusted sequencer preconfirmation. The second line shows the regular L2 block time (another preconfirmation in most protocols).',
  },
  {
    key: 'trustedOrdering',
    header: 'Trusted\nordering',
    tooltip:
      'Policy the centralized sequencer claims to use for ordering transactions. Not enforced by the host chain.',
  },
  {
    key: 'sequencer',
    header: 'Sequencer',
    tooltip: 'Operators controlling real-time transaction ordering.',
  },
  {
    key: 'realtimeCensorshipResistance',
    header: 'Real-time\nCR',
    tooltip:
      'Whether the normal low-latency sequencing path resists censorship by the operator.',
  },
  {
    key: 'forcedInclusion',
    header: 'Forced\ninclusion',
    tooltip:
      'How users bypass the sequencer while the chain is otherwise live (selective censorship), and how many L1 transactions this inclusion path requires.',
  },
  {
    key: 'inclusionDelay',
    header: 'Inclusion\ndelay',
    tooltip:
      'Protocol delay after the first L1 transaction is included until the transaction enters the canonical L2 order while the chain otherwise remains live (selective censorship).',
  },
  {
    key: 'inclusionMechanics',
    header: 'Inclusion\nmechanics',
    tooltip:
      'How forced inclusion works, including transaction format, size, address aliasing, resource limits and permission controls.',
  },
  {
    key: 'exitDelay',
    header: 'Exit\ndelay',
    tooltip:
      'Worst-case protocol delay to force inclusion (sequencer failure), self-propose the resulting state (proposer failure), resolve any challenge and finalize an L1 exit under blanket censorship or operator walkaway.',
  },
  {
    key: 'exitEconomics',
    header: 'Exit\neconomics',
    tooltip:
      'Capital and proof or dispute work required to self-propose and defend one state update needed for an exit under blanket censorship or operator walkaway.',
  },
] satisfies {
  key: CentralizedSequencingTableValueKey
  header: string
  tooltip: string
}[]

export const scalingCentralizedSequencingColumns = [
  ...getScalingCommonProjectColumns(columnHelper, getSequencingHref),
  ...tableValueColumns.map(({ key, header, tooltip }) =>
    columnHelper.accessor((entry) => adjustTableValue(entry[key]), {
      id: key,
      header,
      cell: (ctx) => <TableValueCell value={ctx.row.original[key]} />,
      meta: { tooltip },
      sortDescFirst: true,
      sortingFn: (a, b) => sortTableValues(a.original[key], b.original[key]),
    }),
  ),
]
