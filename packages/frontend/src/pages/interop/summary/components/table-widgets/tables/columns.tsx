import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopTokensCell } from '../TopTokensCell'
import type { LockAndMintRow } from './LockAndMintTable'
import type { NonMintingRow } from './NonMintingTable'
import type { OmniChainRow } from './OmniChainTable'

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
        <span className="font-bold text-label-value-15">
          {ctx.row.original.protocolName}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.volume, {
      header: 'Last 24h\nVolume',
      cell: (ctx) => (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      ),
    }),
  ]
}

const nonMintingColumnHelper = createColumnHelper<NonMintingRow>()
export const nonMintingColumns = [...getCommonColumns(nonMintingColumnHelper)]

const lockAndMintColumnHelper = createColumnHelper<LockAndMintRow>()
export const lockAndMintColumns = [
  ...getCommonColumns(lockAndMintColumnHelper),
  lockAndMintColumnHelper.accessor('averageDuration', {
    header: 'last 24h\navg. transfer time',
    cell: (ctx) => (
      <div className="font-medium text-label-value-15">
        {formatDuration(ctx.row.original.averageDuration)}
      </div>
    ),
  }),
  lockAndMintColumnHelper.accessor('tokens', {
    header: 'tokens by volume',
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
  }),
  omniChainColumnHelper.accessor('tokens', {
    header: 'tokens by volume',
    cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
  }),
]
