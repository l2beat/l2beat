import { UnixTime } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getL2CommonProjectColumns } from '~/components/table/common-project-columns/L2CommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableTooltip } from '~/components/table/TableTooltip'
import type { L2RiskSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'
import { formatDate, formatTimestamp } from '~/utils/dates'

const columnHelper = createColumnHelper<L2RiskSequencingEntry>()

function getSequencingHref(entry: L2RiskSequencingEntry) {
  if (entry.slug === 'ethereum') {
    return '/data-availability/projects/ethereum/ethereum'
  }
  return `/layer2s/projects/${entry.slug}#sequencing`
}

function getStakeDistributionTooltip(
  date: NonNullable<L2RiskSequencingEntry['stakeDistributionDate']>,
): string {
  if (date.dateType === 'snapshot') {
    return `Stake distribution snapshot: ${formatDate(date.date)}.`
  }
  return `Stake distribution fetched: ${formatTimestamp(
    UnixTime.fromDate(new Date(date.date)),
    { mode: 'datetime' },
  )}.`
}

type SequencingTableValueKey =
  | 'sequencerCount'
  | 'blockProductionAccess'
  | 'entryPolicy'
  | 'blockTime'
  | 'blockProduction'
  | 'rotation'
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
    header: 'Block\ntime',
    tooltip: 'Interval between successive blocks.',
  },
  {
    key: 'blockProduction',
    header: 'Block\nproduction',
    tooltip: 'Who controls inclusion and transaction ordering for a block.',
  },
  {
    key: 'rotation',
    header: 'Proposer / committee\nrotation',
    tooltip:
      'How often block production rights move to another proposer and, where applicable, how often a new committee is selected.',
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
] satisfies {
  key: SequencingTableValueKey
  header: string
  tooltip?: string
}[]

export const l2SequencingColumns = [
  ...getL2CommonProjectColumns(columnHelper, getSequencingHref),
  ...tableValueColumns.map(({ key, header, tooltip }) =>
    columnHelper.accessor((entry) => adjustTableValue(entry[key]), {
      id: key,
      header,
      cell: (ctx) => {
        if (key !== 'sequencerCount') {
          return <TableValueCell value={ctx.row.original[key]} />
        }

        const stakeDistributionDate = ctx.row.original.stakeDistributionDate

        return (
          <div className="flex items-center gap-1">
            <TableValueCell value={ctx.row.original[key]} />
            {stakeDistributionDate && (
              <TableTooltip>
                {getStakeDistributionTooltip(stakeDistributionDate)}
              </TableTooltip>
            )}
          </div>
        )
      },
      meta: tooltip ? { tooltip } : undefined,
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) => sortTableValues(a.original[key], b.original[key]),
    }),
  ),
]
