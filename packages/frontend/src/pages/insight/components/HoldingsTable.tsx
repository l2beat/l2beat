import { assert, formatCurrency } from '@l2beat/shared-pure'
import { useState } from 'react'
import { EtherscanLink } from '~/components/EtherscanLink'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import { formatTokenAmount } from '~/pages/interop/components/table/transfer-count-cell/formatTokenAmount'
import type { InsightHolding } from '~/server/features/insight/InsightReport'
import { cn } from '~/utils/cn'
import { BackingCell } from './BackingCell'
import { HoldingsPagination } from './HoldingsPagination'

const PAGE_SIZE = 25
// Spam airdrops come in billions; past this a balance reads better compact.
const COMPACT_AMOUNT_MIN = 1_000_000
const COMPACT_AMOUNT_FORMAT = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

/**
 * One page of holdings at a time: a well-known address holds hundreds of
 * tokens. A table from `md` up, stacked rows below it.
 */
export function HoldingsTable({
  holdings,
  anchorId,
  muteValues,
}: {
  holdings: InsightHolding[]
  /** Where the pagination links jump back to. */
  anchorId: string
  /** Unreviewed values are listed prices, not something to read as worth. */
  muteValues: boolean
}) {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(holdings.length / PAGE_SIZE)
  assert(pageCount >= 1, 'The caller handles an empty list')
  const visible = holdings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-3">
      <Table className="max-md:hidden">
        <TableHeader>
          <TableHeaderRow>
            <TableHead>Token</TableHead>
            <TableHead align="right">Value</TableHead>
            <TableHead align="right">Balance</TableHead>
            <TableHead className="pl-8">Bridges</TableHead>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {visible.map((holding) => (
            <TableRow key={holding.address} highlightId={undefined}>
              <TableCell className="py-2.5">
                <TokenName holding={holding} />
              </TableCell>
              <TableCell align="right" className="tabular-nums">
                <Value holding={holding} muted={muteValues} />
              </TableCell>
              <TableCell align="right" className="text-secondary tabular-nums">
                {formatBalance(holding)}
              </TableCell>
              <TableCell className="whitespace-normal py-2.5 pl-8 text-label-value-13">
                <BackingCell backing={holding.backing} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ul className="flex flex-col divide-y divide-divider md:hidden">
        {visible.map((holding) => (
          <li key={holding.address} className="flex flex-col gap-1.5 py-3">
            <div className="flex items-start justify-between gap-3">
              <TokenName holding={holding} />
              <div className="flex shrink-0 flex-col items-end tabular-nums">
                <span className="text-label-value-15">
                  <Value holding={holding} muted={muteValues} />
                </span>
                <span className="text-label-value-13 text-secondary">
                  {formatBalance(holding)}
                </span>
              </div>
            </div>
            <div className="pl-9 text-label-value-13">
              <BackingCell backing={holding.backing} />
            </div>
          </li>
        ))}
      </ul>
      {pageCount > 1 && (
        <HoldingsPagination
          page={page}
          pageCount={pageCount}
          anchorId={anchorId}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

function TokenName({ holding }: { holding: InsightHolding }) {
  const tokenHref = holding.abstractTokenId
    ? `/tokens/${holding.abstractTokenId}`
    : undefined
  return (
    <div className="flex min-w-0 items-center gap-3">
      {holding.iconUrl ? (
        <img
          src={holding.iconUrl}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          className="size-6 shrink-0 rounded-full"
        />
      ) : (
        <div className="size-6 shrink-0 rounded-full bg-surface-tertiary" />
      )}
      <div className="flex min-w-0 flex-col">
        {tokenHref ? (
          <a
            href={tokenHref}
            className="truncate font-bold text-label-value-15 hover:underline"
          >
            {holding.symbol}
          </a>
        ) : (
          <span className="truncate font-bold text-label-value-15">
            {holding.symbol}
          </span>
        )}
        <span className="flex gap-2 text-label-value-12 text-secondary">
          {holding.issuer ? (
            <span className="capitalize">{holding.issuer}</span>
          ) : (
            <span>No issuer recorded</span>
          )}
          {holding.address === 'native' ? (
            <span>Native</span>
          ) : (
            <EtherscanLink address={holding.address} />
          )}
        </span>
      </div>
    </div>
  )
}

function Value({
  holding,
  muted,
}: {
  holding: InsightHolding
  muted: boolean
}) {
  if (holding.valueUsd === null) {
    return <span className="text-secondary">No price</span>
  }
  return (
    <span className={cn(muted && 'text-secondary')}>
      {formatCurrency(holding.valueUsd, 'usd')}
    </span>
  )
}

function formatBalance(holding: InsightHolding): string {
  const amount = Number(holding.balance) / 10 ** holding.decimals
  if (amount >= COMPACT_AMOUNT_MIN) return COMPACT_AMOUNT_FORMAT.format(amount)
  return formatTokenAmount(amount, holding.valueUsd ?? undefined)
}
