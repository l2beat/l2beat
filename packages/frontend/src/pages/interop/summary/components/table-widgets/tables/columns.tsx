import { formatSeconds } from '@l2beat/shared-pure'
import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopTokensCell } from '../TopTokensCell'
import type { LockMintRow } from './LockMintTable'
import type { NonMintingRow } from './NonMintingTable'
import type { OmniChainRow } from './OmniChainTable'

function getCommonColumns<
  T extends { iconSlug: string; protocolName: string; volume: number },
>(columnHelper: ColumnHelper<T>) {
  return [
    columnHelper.display({
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
    columnHelper.accessor((row) => row.protocolName, {
      header: 'Name',
      cell: (ctx) => (
        <div className="max-w-[76px] break-words font-bold text-label-value-15">
          {ctx.row.original.protocolName}
        </div>
      ),
      meta: {
        cellClassName: 'whitespace-normal',
      },
    }),
    columnHelper.accessor((row) => row.volume, {
      header: 'Last 24h\nVolume',
      cell: (ctx) => (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      ),
      meta: {
        align: 'right',
      },
    }),
  ]
}

const nonMintingColumnHelper = createColumnHelper<NonMintingRow>()
export const nonMintingColumns = [
  ...getCommonColumns(nonMintingColumnHelper),
  nonMintingColumnHelper.accessor('tokens', {
    header: 'tokens by\nvolume',
    meta: {
      cellClassName: '!pr-0',
    },
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
]

const lockMintColumnHelper = createColumnHelper<LockMintRow>()
export const lockMintColumns = [
  ...getCommonColumns(lockMintColumnHelper),
  lockMintColumnHelper.accessor('averageDuration', {
    header: 'last 24h avg.\ntransfer time',
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {formatSeconds(ctx.row.original.averageDuration)}
      </div>
    ),
  }),
  lockMintColumnHelper.accessor('tokens', {
    header: 'tokens\nby volume',
    meta: {
      cellClassName: '!pr-0',
    },
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
]

const omniChainColumnHelper = createColumnHelper<OmniChainRow>()
export const omniChainColumns = [
  ...getCommonColumns(omniChainColumnHelper),
  omniChainColumnHelper.display({
    id: 'token count',
    header: 'Token\ncount',
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {ctx.row.original.tokens.length}
      </div>
    ),
    meta: {
      align: 'right',
    },
  }),
  omniChainColumnHelper.accessor('tokens', {
    header: 'tokens by\nvolume',
    meta: {
      cellClassName: '!pr-0',
    },
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
]
