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
    header: 'Sequencer\noperators',
    tooltip:
      'Number of independent operators controlling real-time transaction ordering.',
  },
  {
    key: 'realtimeCensorshipResistance',
    header: 'Real-time\nCR',
    tooltip:
      'Whether the normal low-latency sequencing path resists censorship by one operator.',
  },
  {
    key: 'forcedInclusion',
    header: 'L1\nfallback',
    tooltip:
      'How users bypass the sequencer through the host chain and how many L1 transactions the complete fallback path requires.',
  },
  {
    key: 'forcedInclusionDelay',
    header: 'Fallback\ndelay',
    tooltip:
      'Protocol delay after the first L1 transaction is included. Wall-clock values are nominal.',
  },
  {
    key: 'fallbackFinalizationDelay',
    header: 'Fallback to\nstate finality',
    tooltip:
      'Worst-case protocol delay from the first L1 fallback transaction until its resulting L2 state can finalize, including permissionless state proposal and challenges. Assumes all required L1 transactions are included.',
  },
  {
    key: 'forcedInclusionConstraints',
    header: 'Fallback\nconstraints',
    tooltip:
      'Transaction format, size, address-aliasing, resource and permission constraints of the L1 fallback path.',
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
