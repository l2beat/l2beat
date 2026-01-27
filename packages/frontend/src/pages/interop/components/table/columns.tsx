import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopChainsCell } from '../top-items/TopChainsCell'
import { TopTokensCell } from '../top-items/TopTokensCell'
import { AvgDurationCell } from './AvgDurationCell'
import { BridgeTypeBadge } from './BridgeTypeBadge'

export type ProtocolRow = ProtocolEntry & BasicTableRow
const columnHelper = createColumnHelper<ProtocolRow>()

const commonColumns = [
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
  columnHelper.accessor('protocolName', {
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

const last24hVolumeColumn = columnHelper.accessor('volume', {
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

const tokensByVolumeColumn = columnHelper.accessor('tokens', {
  header: 'Tokens\nby volume',
  meta: {
    cellClassName: '!pr-0',
    headClassName: 'text-2xs',
  },
  cell: (ctx) => (
    <TopTokensCell
      tokens={ctx.row.original.tokens}
      protocol={{
        name: ctx.row.original.protocolName,
        iconUrl: ctx.row.original.iconUrl,
      }}
    />
  ),
})

const averageDurationColumn = columnHelper.accessor(
  (row) =>
    row.averageDuration.type === 'single'
      ? row.averageDuration.duration
      : (row.averageDuration.in.duration ??
        row.averageDuration.out.duration ??
        Number.POSITIVE_INFINITY),
  {
    header: 'Last 24h avg.\ntransfer time',
    invertSorting: true,
    meta: {
      align: 'right',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => (
      <AvgDurationCell averageDuration={ctx.row.original.averageDuration} />
    ),
  },
)

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
  tokensByVolumeColumn,
]

export function getAllProtocolsColumns(hideTypeColumn?: boolean) {
  return compact([
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
      sortDescFirst: false,
      meta: {
        align: 'right',
        headClassName: 'w-0',
      },
      size: 48,
    }),
    ...commonColumns,
    !hideTypeColumn &&
      columnHelper.accessor('bridgeType', {
        header: 'Type',
        cell: (ctx) => (
          <BridgeTypeBadge bridgeType={ctx.row.original.bridgeType} />
        ),
        meta: {
          headClassName: 'text-2xs',
        },
      }),
    last24hVolumeColumn,
    columnHelper.accessor((row) => row.transferCount, {
      header: 'Last 24h\ntransfer count',
      cell: (ctx) => (
        <div className="font-medium text-label-value-15">
          {ctx.row.original.transferCount}
        </div>
      ),
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
      },
    }),
    averageDurationColumn,
    columnHelper.accessor('averageValue', {
      header: 'Last 24h avg.\ntransfer value',
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
    tokensByVolumeColumn,
    columnHelper.accessor('chains', {
      header: 'Chains\nby volume',
      meta: {
        cellClassName: '!pr-0',
        headClassName: 'text-2xs',
      },
      cell: (ctx) => (
        <TopChainsCell
          chains={ctx.row.original.chains}
          protocol={{
            name: ctx.row.original.protocolName,
            iconUrl: ctx.row.original.iconUrl,
          }}
        />
      ),
    }),
  ])
}
