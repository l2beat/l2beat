import { createColumnHelper } from '@tanstack/react-table'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { LockMintRow } from './LockMintTable'
import type { OmniChainRow } from './OmniChainTable'

const lockMintColumnHelper = createColumnHelper<LockMintRow>()

export const lockMintColumns = [
  lockMintColumnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <img
        className="min-h-[20px] min-w-[20px]"
        src={`/icons/${ctx.row.original.iconSlug}.png`}
        width={20}
        height={20}
        alt={`${ctx.row.original.protocolName} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:pr-1.5!',
    },
    size: 28,
    enableHiding: false,
  }),
  lockMintColumnHelper.accessor('protocolName', {
    header: 'Name',
    cell: (ctx) => (
      <span className="font-bold text-label-value-15">
        {ctx.row.original.protocolName}
      </span>
    ),
  }),
  lockMintColumnHelper.accessor('volume', {
    header: 'Last 24h\nVolume',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatCurrency(ctx.row.original.volume, 'usd')}
      </span>
    ),
  }),
]

const omniChainColumnHelper = createColumnHelper<OmniChainRow>()
export const omniChainColumns = [
  omniChainColumnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <img
        className="min-h-[20px] min-w-[20px]"
        src={`/icons/${ctx.row.original.iconSlug}.png`}
        width={20}
        height={20}
        alt={`${ctx.row.original.protocolName} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:pr-1.5!',
    },
    size: 28,
    enableHiding: false,
  }),
  omniChainColumnHelper.accessor('protocolName', {
    header: 'Name',
    cell: (ctx) => (
      <span className="font-bold text-label-value-15">
        {ctx.row.original.protocolName}
      </span>
    ),
  }),
  omniChainColumnHelper.accessor('volume', {
    header: 'Last 24h\nVolume',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatCurrency(ctx.row.original.volume, 'usd')}
      </span>
    ),
  }),
]
