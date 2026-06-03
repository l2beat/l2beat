import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { ScalingDecentralizedSequencingEntry } from '~/server/features/scaling/decentralized-sequencing/getScalingDecentralizedSequencingEntries'

const columnHelper = createColumnHelper<ScalingDecentralizedSequencingEntry>()

export const scalingDecentralizedSequencingColumns = [
  ...getScalingCommonProjectColumns(columnHelper, (row) => row.sequencingHref),
  columnHelper.accessor((entry) => adjustTableValue(entry.sequencerCount), {
    header: 'Set\nsize',
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.sequencerCount}
        href={ctx.row.original.sequencingHref}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.sequencerCount, b.original.sequencerCount),
  }),
  columnHelper.accessor(
    (entry) => adjustTableValue(entry.blockProductionAccess),
    {
      header: 'Block production\naccess',
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original.blockProductionAccess}
          href={ctx.row.original.sequencingHref}
        />
      ),
      meta: {
        tooltip:
          'Whether new sequencers can join block production without permission.',
      },
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.blockProductionAccess,
          b.original.blockProductionAccess,
        ),
    },
  ),
  columnHelper.accessor((entry) => adjustTableValue(entry.entryPolicy), {
    header: 'Min. stake /\nentry rate',
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.entryPolicy}
        href={ctx.row.original.sequencingHref}
      />
    ),
    meta: {
      tooltip:
        'Stake needed to participate and any rate limit for adding new sequencers.',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.entryPolicy, b.original.entryPolicy),
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.timing), {
    header: 'Block time /\nsequencer rotation',
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.timing}
        href={ctx.row.original.sequencingHref}
      />
    ),
    meta: {
      tooltip:
        'Slot, epoch, or span timing used by the sequencer rotation model.',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) => sortTableValues(a.original.timing, b.original.timing),
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.blockProduction), {
    header: 'Block\nproduction',
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.blockProduction}
        href={ctx.row.original.sequencingHref}
      />
    ),
    meta: {
      tooltip:
        'The model used to estimate inclusion under partial live-chain censorship.',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.blockProduction, b.original.blockProduction),
  }),
  columnHelper.accessor(
    (entry) => adjustTableValue(entry.deterministicCrGadget),
    {
      header: 'Deterministic\nCR',
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original.deterministicCrGadget}
          href={ctx.row.original.sequencingHref}
        />
      ),
      meta: {
        tooltip:
          'Whether there is a deterministic censorship-resistance gadget, such as a bounded forced-inclusion path.',
      },
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.deterministicCrGadget,
          b.original.deterministicCrGadget,
        ),
    },
  ),
  columnHelper.accessor(
    (entry) => adjustTableValue(entry.additionalCrGadgets),
    {
      header: 'Additional\nCR',
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original.additionalCrGadgets}
          href={ctx.row.original.sequencingHref}
        />
      ),
      meta: {
        tooltip:
          'Additional censorship-resistance aids beyond the normal sequencer rotation.',
      },
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.additionalCrGadgets,
          b.original.additionalCrGadgets,
        ),
    },
  ),
]
