import { formatCurrency, formatSeconds, UnixTime } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { InteropNoDataBadge } from '~/pages/interop/components/InteropNoDataBadge'
import type { InteropSelection } from '~/pages/interop/utils/types'
import type { InteropProtocolTransferDetailsItem } from '~/server/features/layer2s/interop/types'
import { formatLocalDateTime, formatTimestamp } from '~/utils/dates'
import { formatTokenAmount } from './formatTokenAmount'

export type TransferRow = InteropProtocolTransferDetailsItem & BasicTableRow

const columnHelper = createColumnHelper<TransferRow>()

export function getTransferColumns(
  selectedChains?: InteropSelection,
  {
    hideBridge = false,
  }: {
    /** A single protocol's page: every row would name the same bridge. */
    hideBridge?: boolean
  } = {},
) {
  const columns = [
    columnHelper.accessor('timestamp', {
      header: 'Timestamp',
      enableSorting: false,
      cell: (ctx) => (
        // When it happened is meta: the amounts and chains are the row.
        <StackedUtcDateTime timestamp={ctx.row.original.timestamp} />
      ),
      meta: {
        headClassName: 'text-2xs',
        tooltip:
          'The time at which the source-chain transfer transaction occurred.',
      },
    }),
    columnHelper.display({
      id: 'tokens',
      header: 'Tokens',
      enableSorting: false,
      cell: (ctx) => {
        const {
          srcAmount,
          srcSymbol,
          srcTokenHref,
          srcTokenIconUrl,
          dstAmount,
          dstSymbol,
          dstTokenHref,
          dstTokenIconUrl,
          valueUsd,
        } = ctx.row.original
        return (
          <div className="flex w-max items-center gap-2 whitespace-nowrap">
            <TokenAmount
              amount={srcAmount}
              valueUsd={valueUsd}
              iconUrl={srcTokenIconUrl}
              symbol={srcSymbol}
              href={srcTokenHref}
              selectedChains={selectedChains}
            />
            <ArrowRightIcon className="size-3.5 shrink-0 fill-brand" />
            <TokenAmount
              amount={dstAmount}
              valueUsd={valueUsd}
              iconUrl={dstTokenIconUrl}
              symbol={dstSymbol}
              href={dstTokenHref}
              selectedChains={selectedChains}
            />
          </div>
        )
      },
      meta: {
        headClassName: 'text-2xs',
        tooltip:
          'The token amount sent on the source chain and the token amount received on the destination chain.',
      },
    }),
    columnHelper.accessor('valueUsd', {
      header: 'Value',
      enableSorting: false,
      cell: (ctx) => {
        const { valueUsd } = ctx.row.original
        if (valueUsd === undefined) return EM_DASH
        return (
          <span className="font-medium text-label-value-14 text-primary">
            {formatCurrency(valueUsd, 'usd')}
          </span>
        )
      },
      meta: {
        // On phones the value starts at the column's left edge, clear of the
        // fade, as in the other sideways-scrolling tables.
        headClassName: 'text-2xs max-md:[&>div]:justify-start',
        cellClassName: 'max-md:text-left',
        align: 'right',
        tooltip: 'The USD value of the transfer.',
      },
    }),
    columnHelper.accessor('bridge', {
      id: 'bridge',
      header: 'Bridge',
      enableSorting: false,
      cell: (ctx) => {
        const { bridge } = ctx.row.original
        return (
          <a
            href={bridge.href}
            className="font-medium text-label-value-14 text-link underline-offset-[0.3em] hover:underline"
          >
            {bridge.name}
          </a>
        )
      },
      meta: {
        headClassName: 'text-2xs',
        tooltip: 'The interoperability protocol used for the transfer.',
      },
    }),
    columnHelper.accessor('duration', {
      header: 'Transfer time',
      enableSorting: false,
      cell: (ctx) => {
        const { duration } = ctx.row.original
        if (duration === undefined) return <InteropNoDataBadge />

        return (
          <span className="font-medium text-label-value-14 text-primary">
            {formatSeconds(duration)}
          </span>
        )
      },
      meta: {
        headClassName: 'text-2xs',
        align: 'right',
        tooltip:
          'The time it took for the transfer to be received on the destination chain.',
      },
    }),
    columnHelper.display({
      id: 'chains',
      header: 'Chains',
      enableSorting: false,
      cell: (ctx) => {
        const {
          srcChain,
          srcChainIconUrl,
          srcTxHashHref,
          dstChain,
          dstChainIconUrl,
          dstTxHashHref,
        } = ctx.row.original

        return (
          // Source over destination: side by side the pair overran the
          // column at 1280 and the destination was cut without a cue.
          <div className="flex w-max flex-col items-start gap-0.5 whitespace-nowrap">
            {/* Indented by the arrow and its gap, so both icons and both
                names start at one x. */}
            <div className="pl-[18px]">
              <ChainCell
                chain={srcChain}
                iconUrl={srcChainIconUrl}
                href={srcTxHashHref}
              />
            </div>
            <div className="flex items-center gap-1">
              <ArrowRightIcon className="size-3.5 shrink-0 fill-brand" />
              <ChainCell
                chain={dstChain}
                iconUrl={dstChainIconUrl}
                href={dstTxHashHref}
              />
            </div>
          </div>
        )
      },
      meta: {
        headClassName: 'text-2xs',
        tooltip:
          'The source and destination chains for this transfer. External links open the corresponding chain transactions.',
      },
    }),
  ]
  return hideBridge
    ? columns.filter((column) => column.id !== 'bridge')
    : columns
}

function TokenAmount({
  amount,
  valueUsd,
  symbol,
  href,
  iconUrl,
  selectedChains,
}: {
  amount: number | undefined
  valueUsd: number | undefined
  symbol: string
  href: string | undefined
  iconUrl: string
  selectedChains: InteropSelection | undefined
}) {
  const label =
    amount === undefined ? symbol : formatTokenAmount(amount, valueUsd)

  const content = (
    <>
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <img src={iconUrl} alt={symbol} className="size-4 rounded-full" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="z-[1000]"
            side="top"
            align="center"
            sideOffset={6}
          >
            {symbol}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </>
  )

  const className =
    'inline-flex shrink-0 items-center gap-1 font-medium text-label-value-14 text-primary'

  if (!href || !selectedChains) {
    return <span className={className}>{content}</span>
  }

  return (
    <a href={href} className={`${className} hover:underline`}>
      {content}
    </a>
  )
}

function ChainCell({
  chain,
  iconUrl,
  href,
}: {
  chain: string
  iconUrl: string | undefined
  href: string | undefined
}) {
  const content = (
    <>
      {iconUrl ? (
        <img src={iconUrl} alt={chain} className="size-4 shrink-0" />
      ) : null}
      <span>{chain}</span>
    </>
  )

  if (!href) {
    return (
      <span className="flex items-center gap-1.5 font-medium text-label-value-13">
        {content}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-1.5 font-medium text-label-value-13 text-link underline-offset-[0.3em] hover:underline"
    >
      {content}
    </a>
  )
}

/**
 * `UtcDateTime` on two lines, date over time, so the column takes the width
 * of a date and the chain pair beside it fits at 1280. Same `<time>` value and
 * local-time hover title.
 */
function StackedUtcDateTime({ timestamp }: { timestamp: number }) {
  const [localTime, setLocalTime] = useState<string>()
  useEffect(() => setLocalTime(formatLocalDateTime(timestamp)), [timestamp])

  return (
    <time
      dateTime={UnixTime.toDate(UnixTime(timestamp)).toISOString()}
      title={localTime && `Your time: ${localTime}`}
      className="flex flex-col whitespace-nowrap font-normal text-label-value-13 text-secondary tabular-nums leading-4"
    >
      <span>{formatTimestamp(timestamp)}</span>
      <span>{formatTimestamp(timestamp, { mode: 'time' })}</span>
    </time>
  )
}
