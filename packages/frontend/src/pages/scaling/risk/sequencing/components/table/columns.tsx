import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { ScalingRiskSequencingEntry } from '~/server/features/scaling/risks/sequencing/getScalingRiskSequencingEntries'

const columnHelper = createColumnHelper<ScalingRiskSequencingEntry>()

function getSequencingHref(entry: ScalingRiskSequencingEntry) {
  if (entry.slug === 'ethereum') return undefined
  return `/scaling/projects/${entry.slug}#sequencing`
}

type SequencingTableValueKey =
  | 'sequencerCount'
  | 'blockProductionAccess'
  | 'entryPolicy'
  | 'blockTime'
  | 'rotation'
  | 'blockProduction'
  | 'deterministicCrGadget'
  | 'additionalCrGadgets'
  | 'exitDelay'
  | 'exitEconomics'

const tableValueColumns = [
  { key: 'sequencerCount', header: 'Set\nsize' },
  {
    key: 'blockProductionAccess',
    header: 'Block production\naccess',
    tooltip:
      'Whether new sequencers can join block production without permission.',
  },
  {
    key: 'entryPolicy',
    header: 'Min. stake /\nentry rate',
    tooltip:
      'Stake needed to participate and any rate limit for adding new sequencers.',
  },
  {
    key: 'blockTime',
    header: 'Block\ntime',
    tooltip: 'Interval between successive blocks.',
  },
  {
    key: 'rotation',
    header: 'Proposer / committee\nrotation',
    tooltip:
      'How often block production rights move to another proposer and, where applicable, how often a new committee is selected.',
  },
  {
    key: 'blockProduction',
    header: 'Block\nproduction',
    tooltip:
      'Who controls inclusion and transaction ordering for a block.',
  },
  {
    key: 'deterministicCrGadget',
    header: 'Deterministic\nCR',
    tooltip:
      'Whether there is a deterministic censorship-resistance gadget, such as a forced-inclusion path.',
  },
  {
    key: 'additionalCrGadgets',
    header: 'Additional\nCR',
    tooltip:
      'Additional censorship-resistance aids beyond the normal sequencer rotation.',
  },
  {
    key: 'exitDelay',
    header: 'Exit\ndelay',
    tooltip:
      'Worst-case delay to make enough state progress to exit after the normal sequencers and state proposers stop.',
  },
  {
    key: 'exitEconomics',
    header: 'Exit\neconomics',
    tooltip:
      'Capital required to make progress and exit if the normal sequencers and state proposers stop. This is distinct from stake used for normal block production.',
  },
] satisfies {
  key: SequencingTableValueKey
  header: string
  tooltip?: string
}[]

export const scalingSequencingColumns = [
  ...getScalingCommonProjectColumns(columnHelper, getSequencingHref),
  ...tableValueColumns.map(({ key, header, tooltip }) =>
    columnHelper.accessor((entry) => adjustTableValue(entry[key]), {
      id: key,
      header,
      cell: (ctx) => <TableValueCell value={ctx.row.original[key]} />,
      meta: tooltip ? { tooltip } : undefined,
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) => sortTableValues(a.original[key], b.original[key]),
    }),
  ),
]
