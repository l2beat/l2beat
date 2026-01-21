import { formatSeconds } from '@l2beat/shared-pure'
import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopTokensCell } from '../TopTokensCell'
import type { LockAndMintRow } from './LockAndMintTable'
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
    cell: (ctx) => {
      const averageDuration = ctx.row.original.averageDuration
      if (averageDuration.type === 'single') {
        return (
          <div className="font-medium text-label-value-15">
            {formatSeconds(averageDuration.duration)}
          </div>
        )
      }
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-col items-start gap-1.5 font-medium text-label-value-15">
              <div>
                <span className="text-[13px] text-secondary leading-none">
                  In:{' '}
                </span>
                {formatSeconds(averageDuration.in.duration)}
              </div>
              <div>
                <span className="text-[13px] text-secondary leading-none">
                  Out:{' '}
                </span>
                {formatSeconds(averageDuration.out.duration)}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5 font-medium text-label-value-15">
              <div>
                <span className="text-[13px] text-secondary leading-none">
                  {averageDuration.in.label}:{' '}
                </span>
                {formatSeconds(averageDuration.in.duration)}
              </div>
              <div>
                <span className="text-[13px] text-secondary leading-none">
                  {averageDuration.out.label}:{' '}
                </span>
                {formatSeconds(averageDuration.out.duration)}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )
    },
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
