import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { ScalingSequencingEntry } from '~/server/features/scaling/sequencing/getScalingSequencingEntries'

const columnHelper = createColumnHelper<ScalingSequencingEntry>()

function getSequencingHref(entry: ScalingSequencingEntry) {
  return `/scaling/projects/${entry.slug}#sequencing`
}

type SequencingTableValueKey =
  | 'sequencerCount'
  | 'blockProductionAccess'
  | 'entryPolicy'
  | 'timing'
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
    key: 'timing',
    header: 'Block time /\nsequencer rotation',
    tooltip:
      'Slot, epoch, or span timing used by the sequencer rotation model.',
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

export const scalingSequencingColumns = [
  ...getScalingCommonProjectColumns(columnHelper, getSequencingHref),
  ...tableValueColumns.map(({ key, header, tooltip }) =>
    columnHelper.accessor((entry) => adjustTableValue(entry[key]), {
      id: key,
      header,
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original[key]}
          href={getSequencingHref(ctx.row.original)}
        />
      ),
      meta: tooltip ? { tooltip } : undefined,
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) => sortTableValues(a.original[key], b.original[key]),
    }),
  ),
]
