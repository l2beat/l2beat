import { createColumnHelper } from '@tanstack/react-table'
import type { BasicTableRow } from '~/components/table/BasicTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { AvgDurationCell } from '../AvgDurationCell'
import { BridgeTypeBadge } from '../BridgeTypeBadge'
import { TopChainsCell } from '../TopChainsCell'
import { TopTokensCell } from '../TopTokensCell'

export type ProtocolRow = ProtocolEntry & BasicTableRow
const protocolColumnHelper = createColumnHelper<ProtocolRow>()

const commonColumns = [
  protocolColumnHelper.display({
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
  protocolColumnHelper.accessor((row) => row.protocolName, {
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
]

const last24hVolumeColumn = protocolColumnHelper.accessor((row) => row.volume, {
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
})

const tokensByVolumeColumn = protocolColumnHelper.accessor('tokens', {
  header: 'tokens\nby volume',
  meta: {
    cellClassName: '!pr-0',
    headClassName: 'text-2xs',
  },
  cell: (ctx) => <TopTokensCell tokens={ctx.row.original.tokens} />,
})

const averageDurationColumn = protocolColumnHelper.accessor('averageDuration', {
  header: 'last 24h avg.\ntransfer time',
  meta: {
    headClassName: 'text-2xs',
  },
  cell: (ctx) => (
    <AvgDurationCell averageDuration={ctx.row.original.averageDuration} />
  ),
})

const transferCountColumn = protocolColumnHelper.display({
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
})

export const nonMintingColumns = [
  ...commonColumns,
  last24hVolumeColumn,
  tokensByVolumeColumn,
]

export const lockAndMintColumns = [
  ...commonColumns,
  last24hVolumeColumn,
  averageDurationColumn,
  tokensByVolumeColumn,
]

export const omniChainColumns = [
  ...commonColumns,
  last24hVolumeColumn,
  transferCountColumn,
  tokensByVolumeColumn,
]

export const allProtocolsColumns = [
  ...commonColumns,
  protocolColumnHelper.accessor('bridgeType', {
    header: 'Type',
    cell: (ctx) => <BridgeTypeBadge bridgeType={ctx.row.original.bridgeType} />,
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  tokensByVolumeColumn,
  protocolColumnHelper.accessor('chains', {
    header: 'chains\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => <TopChainsCell chains={ctx.row.original.chains} />,
  }),
  last24hVolumeColumn,
  transferCountColumn,
  averageDurationColumn,
  protocolColumnHelper.accessor('averageValue', {
    header: 'last 24h avg.\ntransfer value',
    meta: {
      align: 'right',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatCurrency(ctx.row.original.averageValue, 'usd')}
      </span>
    ),
  }),
]
