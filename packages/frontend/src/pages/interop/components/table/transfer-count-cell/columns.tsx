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
    },
  }),
  columnHelper.accessor('srcAmount', {
    header: 'Source token',
    enableSorting: false,
    cell: (ctx) => {
      const { srcAmount, srcSymbol, srcTokenIconUrl } = ctx.row.original
      return (
        <TokenAmount
          amount={srcAmount}
          iconUrl={srcTokenIconUrl}
          symbol={srcSymbol}
        />
      )
    },
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
    },
  }),
  columnHelper.accessor('dstAmount', {
    header: 'Destination token',
    enableSorting: false,
    cell: (ctx) => {
      const { dstAmount, dstSymbol, dstTokenIconUrl } = ctx.row.original
      return (
        <TokenAmount
          amount={dstAmount}
          iconUrl={dstTokenIconUrl}
          symbol={dstSymbol}
        />
      )
    },
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
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
    },
  }),
  columnHelper.accessor('duration', {
    header: 'Transfer time',
    enableSorting: false,
    cell: (ctx) => (
      <span className="font-medium text-label-value-14 text-primary">
        {formatSeconds(ctx.row.original.duration)}
      </span>
    ),
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
    },
  }),
  columnHelper.accessor('srcChain', {
    header: 'Source chain',
    enableSorting: false,
    cell: (ctx) => (
      <div className="font-medium text-label-value-14 capitalize">
        {ctx.row.original.srcChain}
      </div>
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('srcTxHash', {
    header: 'Source tx hash',
    enableSorting: false,
    cell: (ctx) => (
      <TxHashCell
        hash={ctx.row.original.srcTxHash}
        href={ctx.row.original.srcTxHashHref}
      />
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('dstChain', {
    header: 'Destination chain',
    enableSorting: false,
    cell: (ctx) => (
      <div className="font-medium text-label-value-14 capitalize">
        {ctx.row.original.dstChain}
      </div>
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('dstTxHash', {
    header: 'Destination tx hash',
    enableSorting: false,
    cell: (ctx) => (
      <TxHashCell
        hash={ctx.row.original.dstTxHash}
        href={ctx.row.original.dstTxHashHref}
      />
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
]

function TokenAmount({
  amount,
  symbol,
  iconUrl,
}: {
  amount: number | undefined
  symbol: string | undefined
  iconUrl: string
}) {
  if (amount === undefined) return <NoDataBadge />

  const formattedAmount = formatNumberWithCommas(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  })
  if (iconUrl) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-label-value-14 text-primary">
        {formattedAmount}
        <Tooltip>
          <TooltipTrigger asChild>
            <img src={iconUrl} alt={symbol} className="size-4" />
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

  return (
    <span className="font-medium text-label-value-14 text-primary">
      {symbol ? `${formattedAmount} ${symbol}` : formattedAmount}
    </span>
  )
}

function shortenHash(hash: string): string {
  if (hash.length <= 12) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

function TxHashCell({ hash, href }: { hash: string; href: string }) {
  const content = shortenHash(hash)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-medium text-label-value-14 text-link hover:underline"
    >
      {content}
    </a>
  )
}
