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
  | 'sequencerCount'
  | 'realtimeCensorshipResistance'
  | 'forcedInclusion'
  | 'forcedInclusionDelay'
  | 'l1Transactions'

const tableValueColumns = [
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
      'How users bypass the sequencer after submitting through the host chain.',
  },
  {
    key: 'forcedInclusionDelay',
    header: 'Fallback\ndelay',
    tooltip:
      'Protocol delay after the first L1 transaction is included. Wall-clock values are nominal.',
  },
  {
    key: 'l1Transactions',
    header: 'Required\nL1 txs',
    tooltip:
      'Number of L1 transactions needed when the sequencer censors the user.',
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
