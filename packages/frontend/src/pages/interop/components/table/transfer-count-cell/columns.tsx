import { formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CustomLinkIcon } from '~/icons/Outlink'
import { InteropNoDataBadge } from '~/pages/interop/components/InteropNoDataBadge'
import type { InteropProtocolTransferDetailsItem } from '~/server/features/scaling/interop/types'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'

export type TransferRow = InteropProtocolTransferDetailsItem & BasicTableRow

const columnHelper = createColumnHelper<TransferRow>()

export const columns = [
  columnHelper.accessor('timestamp', {
    header: 'Timestamp',
    enableSorting: false,
    cell: (ctx) => (
      <span className="font-medium text-label-value-14 text-primary">
        {formatTimestamp(ctx.row.original.timestamp, { mode: 'datetime' })}
      </span>
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
        srcTokenIconUrl,
        dstAmount,
        dstSymbol,
        dstTokenIconUrl,
      } = ctx.row.original
      return (
        <div className="flex w-max items-center gap-2 whitespace-nowrap">
          <TokenAmount
            amount={srcAmount}
            iconUrl={srcTokenIconUrl}
            symbol={srcSymbol}
          />
          <ArrowRightIcon className="size-3.5 shrink-0 fill-brand" />
          <TokenAmount
            amount={dstAmount}
            iconUrl={dstTokenIconUrl}
            symbol={dstSymbol}
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
      if (valueUsd === undefined) return <NoDataBadge />
      return (
        <span className="font-medium text-label-value-14 text-primary">
          {formatCurrency(valueUsd, 'usd')}
        </span>
      )
    },
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
      tooltip: 'The USD value of the transfer.',
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
        <div className="flex w-max items-center gap-2 whitespace-nowrap">
          <ChainCell
            chain={srcChain}
            iconUrl={srcChainIconUrl}
            href={srcTxHashHref}
          />
          <ArrowRightIcon className="size-3.5 shrink-0 fill-brand" />
          <ChainCell
            chain={dstChain}
            iconUrl={dstChainIconUrl}
            href={dstTxHashHref}
          />
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

function TokenAmount({
  amount,
  symbol,
  iconUrl,
}: {
  amount: number | undefined
  symbol: string
  iconUrl: string
}) {
  const label =
    amount !== undefined
      ? formatNumberWithCommas(amount, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 5,
        })
      : symbol

  return (
    <span className="inline-flex shrink-0 items-center gap-1 font-medium text-label-value-14 text-primary">
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
    </span>
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
      {href ? <CustomLinkIcon className="size-3.5 shrink-0" /> : null}
    </>
  )

  if (!href) {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-label-value-14 capitalize">
        {content}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-1.5 font-medium text-label-value-14 text-link capitalize hover:underline"
    >
      {content}
    </a>
  )
}
