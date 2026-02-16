import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { EM_DASH } from '~/consts/characters'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopChainsCell } from '../top-items/TopChainsCell'
import { TopTokensCell } from '../top-items/TopTokensCell'
import { AvgDurationCell } from './AvgDurationCell'
import { BridgeTypeBadge } from './BridgeTypeBadge'
import { SubgroupTooltip } from './SubgroupTooltip'

export type ProtocolRow = ProtocolEntry & BasicTableRow

const columnHelper = createColumnHelper<ProtocolEntry>()

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
    tooltip:
      'The total USD value of all token transfers completed in the past 24 hours.',
  },
})

const averageInFlightValueColumn = columnHelper.accessor(
  'averageValueInFlight',
  {
    header: 'Last 24h avg.\nin-flight value',
    invertSorting: true,
    meta: {
      align: 'right',
      headClassName: 'text-2xs',
      tooltip:
        'The average USD value of funds in transit at any given second over the past 24 hours.',
    },
    cell: (ctx) => {
      if (ctx.row.original.averageValueInFlight === undefined) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.averageValueInFlight, 'usd')}
        </span>
      )
    },
  },
)

export function getAllProtocolsColumns(
  type: KnownInteropBridgeType | undefined,
  hideTypeColumn?: boolean,
  showAverageInFlightValueColumn?: boolean,
  showNetMintedValueColumn?: boolean,
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
      size: 44,
    }),
    ...commonColumns,
    !hideTypeColumn &&
      columnHelper.accessor('bridgeTypes', {
        header: 'Type',
        enableSorting: false,
        cell: (ctx) => {
          return (
            <div className="flex items-center gap-1" key={ctx.row.original.id}>
              {ctx.row.original.bridgeTypes.map((bridgeType) => (
                <BridgeTypeBadge key={bridgeType} bridgeType={bridgeType} />
              ))}
            </div>
          )
        },
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
        tooltip:
          'The total number of token transfer transactions completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor(
      (row) =>
        row.averageDuration?.type === 'unknown' || row.averageDuration === null
          ? undefined
          : row.averageDuration.type === 'single'
            ? row.averageDuration.duration
            : (row.averageDuration.in.duration ??
              row.averageDuration.out.duration ??
              Number.POSITIVE_INFINITY),
      {
        header: 'Last 24h avg.\ntransfer time',
        invertSorting: true,
        sortUndefined: 'last',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            'The average time it takes for a transfer to be received on the destination chain, measured over the past 24 hours.',
        },
        cell: (ctx) => {
          if (ctx.row.original.averageDuration === null) return EM_DASH
          return (
            <AvgDurationCell
              averageDuration={ctx.row.original.averageDuration}
            />
          )
        },
      },
    ),
    columnHelper.accessor('averageValue', {
      header: 'Last 24h avg.\ntransfer value',
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The average USD value per token transfer completed in the past 24 hours.',
      },
      cell: (ctx) => (
        <span className="font-medium text-label-value-15">
          {ctx.row.original.averageValue
            ? formatCurrency(ctx.row.original.averageValue, 'usd')
            : EM_DASH}
        </span>
      ),
    }),
    showAverageInFlightValueColumn && averageInFlightValueColumn,
    showNetMintedValueColumn &&
      columnHelper.accessor('netMintedValue', {
        header: 'Last 24h net\nminted value',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
        },
        cell: (ctx) => (
          <span className="font-medium text-label-value-15">
            {ctx.row.original.netMintedValue
              ? formatCurrency(ctx.row.original.netMintedValue, 'usd')
              : EM_DASH}
          </span>
        ),
      }),
    columnHelper.accessor('tokens', {
      header: 'Tokens\nby volume',
      meta: {
        cellClassName: '!pr-0',
        headClassName: 'text-2xs',
        tooltip:
          'Tokens involved in transfers over the past 24 hours, ranked by total transfer volume. For each transfer, value is counted towards both the source and the destination token.',
      },
      cell: (ctx) => {
        if (ctx.row.original.tokens.items.length === 0) return EM_DASH
        return (
          <TopTokensCell
            topItems={ctx.row.original.tokens}
            type={type}
            protocol={{
              id: ctx.row.original.id,
              name: ctx.row.original.protocolName,
              iconUrl: ctx.row.original.iconUrl,
            }}
            showNetMintedValueColumn={showNetMintedValueColumn}
          />
        )
      },
    }),
    columnHelper.accessor('chains', {
      header: 'Chains\nby volume',
      meta: {
        cellClassName: '!pr-0',
        headClassName: 'text-2xs',
        tooltip:
          'Chains involved in transfers over the past 24 hours, ranked by total transfer volume. For each transfer, value is counted towards both the source and the destination chain.',
      },
      cell: (ctx) => {
        if (ctx.row.original.chains.items.length === 0) return EM_DASH
        return (
          <TopChainsCell
            topItems={ctx.row.original.chains}
            protocol={{
              id: ctx.row.original.id,
              name: ctx.row.original.protocolName,
              iconUrl: ctx.row.original.iconUrl,
            }}
            showNetMintedValueColumn={showNetMintedValueColumn}
          />
        )
      },
    }),
  ])
}
