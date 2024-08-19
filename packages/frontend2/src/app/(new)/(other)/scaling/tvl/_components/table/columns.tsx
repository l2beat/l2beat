import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { cn } from '~/utils/cn'
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
    if (!value.breakdown) {
      return <UpcomingBadge />
    }
    return (
      <TotalValueLockedCell
        tvlWarnings={value.warnings}
        breakdown={{
          canonical: value.breakdown.canonical,
          external: value.breakdown.external,
          native: value.breakdown.native,
        }}
        change={value.totalChange}
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
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} type="layer2" />,
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
      if (!value.breakdown) {
        return <UpcomingBadge />
      }

      return (
        <ValueLockedCell
          value={value.breakdown.canonical}
          change={value.change?.canonical}
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
      if (!value.breakdown) {
        return <UpcomingBadge />
      }

      return (
        <ValueLockedCell
          value={value.breakdown.external}
          change={value.change?.external}
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
      if (!value.breakdown) {
        return <UpcomingBadge />
      }

      return (
        <ValueLockedCell
          value={value.breakdown.native}
          change={value.change?.native}
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
