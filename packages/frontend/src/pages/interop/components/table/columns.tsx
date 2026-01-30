import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopChainsCell } from '../top-items/TopChainsCell'
import { TopTokensCell } from '../top-items/TopTokensCell'
import { AvgDurationCell } from './AvgDurationCell'
import { BridgeTypeBadge } from './BridgeTypeBadge'
import { SubgroupTooltip } from './SubgroupTooltip'

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
      <TwoRowCell>
        <TwoRowCell.First className="flex items-center gap-2 pr-1 leading-none!">
          <div className="w-fit max-w-[76px] break-words font-bold text-label-value-15 md:leading-none">
            {ctx.row.original.protocolName}
          </div>
          {ctx.row.original.subgroup && (
            <SubgroupTooltip subgroup={ctx.row.original.subgroup} />
          )}
        </TwoRowCell.First>
        <TwoRowCell.Second>
          {ctx.row.original.isAggregate && 'Aggregate'}
        </TwoRowCell.Second>
      </TwoRowCell>
    ),
    meta: {
      cellClassName: 'whitespace-normal py-1',
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

const averageInFlightValueColumn = columnHelper.accessor(
  'averageValueInFlight',
  {
    header: 'Last 24h avg.\nin-flight value',
    invertSorting: true,
    meta: {
      align: 'right',
      headClassName: 'text-2xs',
    },
    cell: (ctx) => {
      if (ctx.row.original.averageValueInFlight === undefined) return '-'
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.averageValueInFlight, 'usd')}
        </span>
      )
    },
  },
)

export const nonMintingColumns = [
  ...commonColumns,
  last24hVolumeColumn,
  averageInFlightValueColumn,
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

export function getAllProtocolsColumns(
  hideTypeColumn?: boolean,
  showAverageInFlightValueColumn?: boolean,
) {
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
    showAverageInFlightValueColumn && averageInFlightValueColumn,
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
