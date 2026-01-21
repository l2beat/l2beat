import { formatSeconds } from '@l2beat/shared-pure'
import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { TopChainsCell } from '../TopChainsCell'
import { TopTokensCell } from '../TopTokensCell'
import type { LockAndMintRow } from './LockAndMintTable'
import type { NonMintingRow } from './NonMintingTable'
import type { OmniChainRow } from './OmniChainTable'
import type { AllProtocolsRow } from './AllProtocolsTable'

function getCommonColumns<
  T extends {
    iconUrl: string
    protocolName: string
    volume: number
  },
>(columnHelper: ColumnHelper<T>) {
  return [
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => (
        <img
          className="min-h-[20px] min-w-[20px]"
          src={ctx.row.original.iconUrl}
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
        headClassName: 'text-2xs',
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
        headClassName: 'text-2xs text-right',
      },
    }),
  ]
}

const nonMintingColumnHelper = createColumnHelper<NonMintingRow>()
export const nonMintingColumns = [
  ...getCommonColumns(nonMintingColumnHelper),
  nonMintingColumnHelper.accessor('tokens', {
    header: 'tokens\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
]

const lockAndMintColumnHelper = createColumnHelper<LockAndMintRow>()
export const lockAndMintColumns = [
  ...getCommonColumns(lockAndMintColumnHelper),
  lockAndMintColumnHelper.accessor('averageDuration', {
    header: 'last 24h avg.\ntransfer time',
    meta: {
      headClassName: 'text-2xs',
    },
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {formatSeconds(ctx.row.original.averageDuration)}
      </div>
    ),
  }),
  lockAndMintColumnHelper.accessor('tokens', {
    header: 'tokens\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
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
      headClassName: 'text-2xs',
    },
  }),
  omniChainColumnHelper.accessor('tokens', {
    header: 'tokens\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
]

const allProtocolsColumnHelper = createColumnHelper<AllProtocolsRow>()
export const allProtocolsColumns = [
  // Logo column (from getCommonColumns)
  allProtocolsColumnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <img
        className="min-h-[20px] min-w-[20px]"
        src={ctx.row.original.iconUrl}
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
  // Name column
  allProtocolsColumnHelper.accessor((row) => row.protocolName, {
    header: 'Name',
    cell: (ctx) => (
      <div className="max-w-[76px] break-words font-bold text-label-value-15">
        {ctx.row.original.protocolName}
      </div>
    ),
    meta: {
      cellClassName: 'whitespace-normal',
      headClassName: 'text-2xs',
    },
  }),
  // Type column
  allProtocolsColumnHelper.accessor('bridgeType', {
    header: 'Type',
    cell: (ctx) => {
      const type = ctx.row.original.bridgeType
      const displayType =
        type === 'lockAndMint'
          ? 'Lock & Mint'
          : type === 'nonMinting'
            ? 'Non-minting'
            : 'Omnichain'
      return (
        <div className="font-medium text-label-value-15">{displayType}</div>
      )
    },
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  // Last 24H Volume column
  allProtocolsColumnHelper.accessor((row) => row.volume, {
    header: 'Last 24h\nVolume',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatCurrency(ctx.row.original.volume, 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
      headClassName: 'text-2xs text-right',
    },
  }),
  // Last 24H Transfer Count column
  allProtocolsColumnHelper.accessor('transferCount', {
    header: 'Last 24h\nTransfer Count',
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {ctx.row.original.transferCount.toLocaleString()}
      </div>
    ),
    meta: {
      align: 'right',
      headClassName: 'text-2xs text-right',
    },
  }),
  // Last 24H Avg Transfer Time column
  allProtocolsColumnHelper.accessor('averageDuration', {
    header: 'Last 24h Avg.\nTransfer Time',
    meta: {
      headClassName: 'text-2xs',
    },
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {formatSeconds(ctx.row.original.averageDuration)}
      </div>
    ),
  }),
  // Last 24H Avg Transfer Value column
  allProtocolsColumnHelper.accessor('averageValue', {
    header: 'Last 24h Avg.\nTransfer Value',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatCurrency(ctx.row.original.averageValue, 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
      headClassName: 'text-2xs text-right',
    },
  }),
  // Tokens by Volume column
  allProtocolsColumnHelper.accessor('tokens', {
    header: 'tokens\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
  // Chains by Volume column
  allProtocolsColumnHelper.accessor('chains', {
    header: 'chains\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => <TopChainsCell chains={ctx.row.original.chains} />,
  }),
]
