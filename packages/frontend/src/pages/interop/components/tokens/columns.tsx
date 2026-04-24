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
  ProtocolDisplayable,
  TokenData,
  TokenFlowData,
  TokensPairData,
} from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { InteropNoDataBadge } from '../InteropNoDataBadge'
import { AvgDurationCell } from '../table/AvgDurationCell'
import { TokenFlowsCell } from './TokenFlowsCell'

export type TokenRow = TokenData & BasicTableRow
export type TokensPairRow = TokensPairData & BasicTableRow

type CommonRow = {
  topProtocol?: ProtocolDisplayable
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  minTransferValueUsd?: number
  maxTransferValueUsd?: number
  flows: TokenFlowData[]
}

function getCommonColumns<T extends CommonRow>(
  columnHelper: ColumnHelper<T>,
  showTopProtocolColumn?: boolean,
) {
  return compact([
    showTopProtocolColumn &&
      columnHelper.accessor((row) => row.topProtocol?.name, {
        id: 'topProtocol',
        header: 'Top\nprotocol',
        cell: (ctx) => {
          const topProtocol = ctx.row.original.topProtocol
          if (!topProtocol) return EM_DASH

          return (
            <div className="flex items-center gap-1.5">
              <img
                className="size-4 rounded-full bg-white shadow"
                src={topProtocol.iconUrl}
                width={16}
                height={16}
                alt={`${topProtocol.name} icon`}
              />
              <span className="font-medium text-label-value-15">
                {topProtocol.name}
              </span>
            </div>
          )
        },
        meta: {
          tooltip:
            'The protocol with the highest total transfer volume for this token over the past 24 hours.',
        },
      }),
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
        tooltip:
          'The total USD value of all token transfers completed in the past 24 hours.',
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
        tooltip:
          'The total number of token transfer transactions completed in the past 24 hours.',
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
          if (ctx.row.original.avgDuration === null)
            return <InteropNoDataBadge />
          return (
            <AvgDurationCell averageDuration={ctx.row.original.avgDuration} />
          )
        },
        meta: {
          align: 'right',
          tooltip:
            'The average time it takes for a transfer to be received on the destination chain, measured over the past 24 hours.',
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
      meta: {
        tooltip:
          'The average USD value per token transfer completed in the past 24 hours.',
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
        meta: {
          tooltip:
            'The distribution of this token volume across source and destination chains over the past 24 hours.',
        },
      },
    ),
  ])
}

const tokenColumnHelper = createColumnHelper<TokenRow>()
export const getTopTokensColumns = ({
  showNetMintedValueColumn,
  showTopProtocolColumn,
}: {
  showNetMintedValueColumn?: boolean
  showTopProtocolColumn?: boolean
} = {}) =>
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
    ...getCommonColumns(tokenColumnHelper, showTopProtocolColumn),
    showNetMintedValueColumn &&
      tokenColumnHelper.accessor('netMintedValue', {
        header: 'Last 24h net\nminted value',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            "The USD value of tokens minted through the protocol minus the USD value of tokens that were bridged back, or burned. It represents the net USD value added to the protocol's total value locked.",
        },
        cell: (ctx) => {
          if (ctx.row.original.netMintedValue === undefined)
            return <InteropNoDataBadge />
          return (
            <span className="font-medium text-label-value-15">
              {formatCurrency(ctx.row.original.netMintedValue, 'usd')}
            </span>
          )
        },
      }),
  ])

const tokensPairColumnHelper = createColumnHelper<TokensPairRow>()
export const getTopTokensPairsColumns = (showTopProtocolColumn?: boolean) => [
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
  ...getCommonColumns(tokensPairColumnHelper, showTopProtocolColumn),
]
