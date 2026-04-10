import { type ColumnHelper, createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { EM_DASH } from '~/consts/characters'
import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import type {
  AverageDuration,
  TokenData,
  TokenFlowData,
  TokensPairData,
} from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { AvgDurationCell } from '../table/AvgDurationCell'
import { TokenFlowsCell } from './TokenFlowsCell'

export type TokenRow = TokenData & BasicTableRow
export type TokensPairRow = TokensPairData & BasicTableRow

type CommonRow = {
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  minTransferValueUsd?: number
  maxTransferValueUsd?: number
  flows: TokenFlowData[]
}

function getCommonColumns<T extends CommonRow>(columnHelper: ColumnHelper<T>) {
  return [
    columnHelper.accessor((row) => row.volume, {
      id: 'volume',
      header: 'Last 24h\nVolume',
      cell: (ctx) => {
        if (ctx.row.original.volume === null) return EM_DASH
        return (
          <span className="font-medium text-label-value-15">
            {formatCurrency(ctx.row.original.volume, 'usd')}
          </span>
        )
      },
      meta: {
        align: 'right',
      },
    }),
    columnHelper.accessor((row) => row.transferCount, {
      header: 'Last 24h\ntransfer count',
      cell: (ctx) => (
        <div className="font-medium text-label-value-15">
          {ctx.row.original.transferCount}
        </div>
      ),
      meta: {
        align: 'right',
      },
    }),
    columnHelper.accessor(
      (row) =>
        row.avgDuration?.type === 'unknown' || row.avgDuration === null
          ? undefined
          : row.avgDuration.type === 'single'
            ? row.avgDuration.duration
            : Math.min(
                ...row.avgDuration.splits
                  .filter((split) => split.duration !== null)
                  .map((split) => split.duration ?? Number.POSITIVE_INFINITY),
              ),
      {
        header: 'Last 24h avg.\ntransfer time',
        cell: (ctx) => {
          if (ctx.row.original.avgDuration === null) return EM_DASH
          return (
            <AvgDurationCell averageDuration={ctx.row.original.avgDuration} />
          )
        },
        meta: {
          align: 'right',
        },
      },
    ),
    columnHelper.accessor((row) => row.avgValue, {
      header: 'Last 24h avg.\ntransfer value',
      cell: (ctx) => {
        if (ctx.row.original.avgValue === null) return EM_DASH

        const averageValue = formatCurrency(ctx.row.original.avgValue, 'usd')
        const minValue =
          ctx.row.original.minTransferValueUsd !== undefined
            ? formatCurrency(ctx.row.original.minTransferValueUsd, 'usd')
            : EM_DASH
        const maxValue =
          ctx.row.original.maxTransferValueUsd !== undefined
            ? formatCurrency(ctx.row.original.maxTransferValueUsd, 'usd')
            : EM_DASH

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium text-label-value-15 text-primary">
                {averageValue}
              </span>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="z-[1000] min-w-[200px]">
                <div className="font-medium text-label-value-14 text-secondary">
                  Transfer value
                </div>
                <HorizontalSeparator className="my-1" />
                <div className="flex items-center justify-between gap-x-6">
                  <span className="font-medium text-label-value-14">
                    Minimum
                  </span>
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {minValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-x-6">
                  <span className="font-medium text-label-value-14">
                    Average
                  </span>
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {averageValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-x-6">
                  <span className="font-medium text-label-value-14">
                    Maximum
                  </span>
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {maxValue}
                  </span>
                </div>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )
      },
    }),
    columnHelper.accessor(
      (row) => row.flows?.reduce((acc, flow) => acc + flow.volume, 0) ?? 0,
      {
        id: 'flows',
        header: 'Flows',
        cell: (ctx) => {
          const flows = ctx.row.original.flows
          if (!flows || flows.length === 0) return EM_DASH

          return <TokenFlowsCell flows={flows} />
        },
      },
    ),
  ]
}

const tokenColumnHelper = createColumnHelper<TokenRow>()
export const getTopTokensColumns = (showNetMintedValueColumn?: boolean) =>
  compact([
    tokenColumnHelper.display({
      id: 'icon',
      cell: (ctx) => (
        <img
          className="min-h-[20px] min-w-[20px] rounded-full bg-white shadow"
          src={ctx.row.original.iconUrl}
          width={20}
          height={20}
          alt={`${ctx.row.original.symbol} icon`}
        />
      ),
      meta: {
        headClassName: 'w-[32px]',
      },
      size: 28,
      enableHiding: false,
    }),
    tokenColumnHelper.accessor('symbol', {
      header: 'Symbol',
      cell: (ctx) => (
        <TwoRowCell>
          <TwoRowCell.First className="font-bold leading-none!">
            {ctx.row.original.symbol}
          </TwoRowCell.First>
          {ctx.row.original.issuer && (
            <TwoRowCell.Second>
              Issued by{' '}
              <span className="capitalize">{ctx.row.original.issuer}</span>
            </TwoRowCell.Second>
          )}
        </TwoRowCell>
      ),
      meta: {
        headClassName: 'pl-0!',
        cellClassName: 'pl-0!',
      },
    }),
    ...getCommonColumns(tokenColumnHelper),
    showNetMintedValueColumn &&
      tokenColumnHelper.accessor('netMintedValue', {
        header: 'Last 24h net\nminted value',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
        },
        cell: (ctx) => {
          if (ctx.row.original.netMintedValue === undefined) return EM_DASH
          return (
            <span className="font-medium text-label-value-15">
              {formatCurrency(ctx.row.original.netMintedValue, 'usd')}
            </span>
          )
        },
      }),
  ])

const tokensPairColumnHelper = createColumnHelper<TokensPairRow>()
export const topTokensPairsColumns = [
  tokensPairColumnHelper.accessor(
    (row) =>
      row.id === 'unknown'
        ? 'Unknown pairs'
        : `${row.tokenA.symbol} ${row.tokenB.symbol}`,
    {
      id: 'pair',
      header: 'Pair',
      cell: (ctx) => {
        const { id, tokenA, tokenB } = ctx.row.original
        if (id === 'unknown') {
          return <span className="font-bold">Unknown pairs</span>
        }
        return (
          <div className="flex w-max items-center gap-1 whitespace-nowrap font-bold">
            <img
              className="size-[20px] rounded-full bg-white shadow"
              src={tokenA.iconUrl}
              width={20}
              height={20}
              alt={`${tokenA.symbol} icon`}
            />
            <span>{tokenA.symbol}</span>
            <BidirectionalArrowIcon className="size-4 shrink-0 fill-brand" />
            <img
              className="size-[20px] rounded-full bg-white shadow"
              src={tokenB.iconUrl}
              width={20}
              height={20}
              alt={`${tokenB.symbol} icon`}
            />
            <span>{tokenB.symbol}</span>
          </div>
        )
      },
      meta: {
        cellClassName: 'pl-3!',
        headClassName: 'pl-3!',
      },
    },
  ),
  ...getCommonColumns(tokensPairColumnHelper),
]
