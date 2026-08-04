import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableTooltip } from '~/components/table/TableTooltip'
import type { ScalingRiskSequencingEntry } from '~/server/features/scaling/risks/sequencing/getScalingRiskSequencingEntries'
import { formatDate } from '~/utils/dates'

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

export const scalingSequencingColumns = [
  ...getScalingCommonProjectColumns(columnHelper, getSequencingHref),
  ...tableValueColumns.map(({ key, header, tooltip }) =>
    columnHelper.accessor((entry) => adjustTableValue(entry[key]), {
      id: key,
      header,
      cell: (ctx) =>
        key === 'sequencerCount' ? (
          <div className="flex items-center gap-1">
            <TableValueCell value={ctx.row.original[key]} />
            {ctx.row.original.stakeDistributionSnapshotDate && (
              <TableTooltip>
                Stake distribution snapshot:{' '}
                {formatDate(ctx.row.original.stakeDistributionSnapshotDate)}.
              </TableTooltip>
            )}
          </div>
        ) : (
          <TableValueCell value={ctx.row.original[key]} />
        ),
      meta: tooltip ? { tooltip } : undefined,
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) => sortTableValues(a.original[key], b.original[key]),
    }),
  ),
]
