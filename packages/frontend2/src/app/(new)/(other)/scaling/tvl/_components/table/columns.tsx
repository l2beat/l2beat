import { createColumnHelper } from '@tanstack/react-table'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { getCommonProjectColumns } from '~/app/_components/table/common-project-columns'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'
import { type ScalingTvlTableRow } from '../../_utils/to-table-rows'
import { TotalValueLockedCell } from './total-value-locked-cell'
import { ValueLockedCell } from './value-locked-cell'

const columnHelper = createColumnHelper<ScalingTvlTableRow>()

const totalColumn = columnHelper.accessor('tvl', {
  id: 'total',
  header: 'Total',
  cell: (ctx) => {
    const value = ctx.getValue()
    if (!value.data) {
      return <UpcomingBadge />
    }
    return (
      <TotalValueLockedCell
        tvlWarnings={value.warnings}
        breakdown={{
          canonical: value.data.breakdown.canonical,
          external: value.data.breakdown.external,
          native: value.data.breakdown.native,
        }}
        change={value.data.totalChange}
      />
    )
  },
  sortUndefined: 'last',
  meta: {
    align: 'center',
    tooltip: 'Total = Canonical + External + Native',
  },
})

export const scalingTvlCokumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
        showIsL3={true}
      />
    ),
  }),
  columnHelper.group({
    id: 'data',
    header: undefined,
    columns: [totalColumn],
  }),
  columnHelper.accessor('tvl', {
    id: 'canonical',
    header: 'Canonical',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value.data) {
        return <UpcomingBadge />
      }

      return (
        <ValueLockedCell
          value={value.data.breakdown.canonical}
          change={value.data.change.canonical}
        />
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'center',
      tooltip:
        'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-purple-100'),
    },
  }),
  columnHelper.accessor('tvl', {
    id: 'external',
    header: 'External',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value.data) {
        return <UpcomingBadge />
      }

      return (
        <ValueLockedCell
          value={value.data.breakdown.external}
          change={value.data.change.external}
        />
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'center',
      tooltip:
        'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-yellow-200'),
    },
  }),
  columnHelper.accessor('tvl', {
    id: 'native',
    header: 'Native',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value.data) {
        return <UpcomingBadge />
      }

      return (
        <ValueLockedCell
          value={value.data.breakdown.native}
          change={value.data.change.native}
        />
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'center',
      tooltip:
        'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-pink-100'),
    },
  }),
]
