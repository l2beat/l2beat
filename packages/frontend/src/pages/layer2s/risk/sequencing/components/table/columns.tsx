import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getLayer2sCommonProjectColumns } from '~/components/table/common-project-columns/Layer2sCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { Layer2sRiskSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getLayer2sRiskSequencingEntries'

const columnHelper = createColumnHelper<Layer2sRiskSequencingEntry>()

function getSequencingHref(entry: Layer2sRiskSequencingEntry) {
  return `/layer2s/projects/${entry.slug}#sequencing`
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
    header: 'L2 block\ntime',
    tooltip: 'Interval between successive L2 blocks.',
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
      'The model used to estimate inclusion under partial live-chain censorship.',
  },
  {
    key: 'deterministicCrGadget',
    header: 'Deterministic\nCR',
    tooltip:
      'Whether there is a deterministic censorship-resistance gadget, such as a bounded forced-inclusion path.',
  },
  {
    key: 'additionalCrGadgets',
    header: 'Additional\nCR',
    tooltip:
      'Additional censorship-resistance aids beyond the normal sequencer rotation.',
  },
] satisfies {
  key: SequencingTableValueKey
  header: string
  tooltip?: string
}[]

export const layer2sSequencingColumns = [
  ...getLayer2sCommonProjectColumns(columnHelper, getSequencingHref),
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
