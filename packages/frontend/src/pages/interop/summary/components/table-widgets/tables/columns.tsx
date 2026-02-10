import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { AvgDurationCell } from '~/pages/interop/components/table/AvgDurationCell'
import { SubgroupTooltip } from '~/pages/interop/components/table/SubgroupTooltip'
import { TopTokensCell } from '~/pages/interop/components/top-items/TopTokensCell'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTop3Items'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type {
  LockAndMintProtocolEntry,
  NonMintingProtocolEntry,
  OmniChainProtocolEntry,
} from './getBridgeTypeEntries'

export type NonMintingProtocolRow = NonMintingProtocolEntry & BasicTableRow
export type LockAndMintProtocolRow = LockAndMintProtocolEntry & BasicTableRow
export type OmniChainProtocolRow = OmniChainProtocolEntry & BasicTableRow

const nonMintingColumnHelper = createColumnHelper<NonMintingProtocolRow>()
const lockAndMintColumnHelper = createColumnHelper<LockAndMintProtocolRow>()
const omniChainColumnHelper = createColumnHelper<OmniChainProtocolRow>()

function getCommonColumns<
  T extends {
    iconUrl: string
    protocolName: string
    subgroup: { name: string; iconUrl: string } | undefined
    isAggregate: boolean | undefined
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
}

function getLast24hVolumeColumn<T extends { volume: number }>(
  columnHelper: ColumnHelper<T>,
) {
  return columnHelper.accessor((row) => row.volume, {
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
}

function getTokensByVolumeColumn<
  T extends {
    tokens: TopItems<TokenData>
    protocolName: string
    iconUrl: string
  },
>(columnHelper: ColumnHelper<T>) {
  return columnHelper.accessor((row) => row.tokens, {
    header: 'Tokens\nby volume',
    meta: {
      cellClassName: '!pr-0',
      headClassName: 'text-2xs',
      tooltip:
        'Tokens involved in transfers over the past 24 hours, ranked by total transfer volume. For each transfer, value is counted towards both the source and the destination token.',
    },
    cell: (ctx) => (
      <TopTokensCell
        topItems={ctx.row.original.tokens}
        protocol={{
          name: ctx.row.original.protocolName,
          iconUrl: ctx.row.original.iconUrl,
        }}
      />
    ),
  })
}

export const nonMintingColumns = [
  ...getCommonColumns(nonMintingColumnHelper),
  getLast24hVolumeColumn(nonMintingColumnHelper),
  nonMintingColumnHelper.accessor('averageValueInFlight', {
    header: 'Last 24h avg.\nin-flight value',
    invertSorting: true,
    meta: {
      align: 'right',
      headClassName: 'text-2xs',
      tooltip:
        'The average USD value of funds in transit at any given second over the past 24 hours.',
    },
    cell: (ctx) => {
      if (ctx.row.original.averageValueInFlight === undefined) return '-'
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.averageValueInFlight, 'usd')}
        </span>
      )
    },
  }),
  getTokensByVolumeColumn(nonMintingColumnHelper),
]

export const lockAndMintColumns = [
  ...getCommonColumns(lockAndMintColumnHelper),
  getLast24hVolumeColumn(lockAndMintColumnHelper),
  lockAndMintColumnHelper.accessor(
    (row) =>
      row.averageDuration.type === 'unknown'
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
      cell: (ctx) => (
        <AvgDurationCell averageDuration={ctx.row.original.averageDuration} />
      ),
    },
  ),
  getTokensByVolumeColumn(lockAndMintColumnHelper),
]

export const omniChainColumns = [
  ...getCommonColumns(omniChainColumnHelper),
  getLast24hVolumeColumn(omniChainColumnHelper),
  getTokensByVolumeColumn(omniChainColumnHelper),
]
