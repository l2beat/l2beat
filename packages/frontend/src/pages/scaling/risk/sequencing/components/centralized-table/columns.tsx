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
  | 'sequencerCount'
  | 'realtimeCensorshipResistance'
  | 'forcedInclusion'
  | 'forcedInclusionDelay'
  | 'fallbackFinalizationDelay'
  | 'forcedInclusionConstraints'
  | 'exitEconomics'

const tableValueColumns = [
  {
    key: 'trustedPreconfirmation',
    header: 'Trusted\npreconfirmation',
    tooltip:
      'Target latency of the trusted sequencer preconfirmation. The second line shows the regular L2 block time.',
  },
  {
    key: 'trustedOrdering',
    header: 'Trusted\nordering',
    tooltip:
      'Policy the centralized sequencer claims to use for ordering transactions. It is not enforced by the host chain.',
  },
  {
    key: 'sequencerCount',
    header: 'Sequencer',
    tooltip:
      'Number of independent operators controlling real-time transaction ordering.',
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
      'How users bypass the sequencer while the chain is otherwise live, and how many L1 transactions this inclusion path requires.',
  },
  {
    key: 'forcedInclusionDelay',
    header: 'Inclusion\ndelay',
    tooltip:
      'Protocol delay after the first L1 transaction is included until the transaction enters the canonical L2 order. Wall-clock values are nominal.',
  },
  {
    key: 'forcedInclusionConstraints',
    header: 'Inclusion\nconstraints',
    tooltip:
      'Transaction format, size, address-aliasing, resource and permission constraints of the live-inclusion path.',
  },
  {
    key: 'fallbackFinalizationDelay',
    header: 'Exit\ndelay',
    tooltip:
      'Worst-case protocol delay from the first L1 inclusion transaction until its resulting state can support an L1 exit, including permissionless state proposal and challenges. Assumes all required L1 transactions are included.',
  },
  {
    key: 'exitEconomics',
    header: 'Exit\neconomics',
    tooltip:
      'Capital required to self-propose and defend the state needed for an exit after operator walkaway. The second line shows which side has the advantage in a resource-exhaustion attack.',
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
