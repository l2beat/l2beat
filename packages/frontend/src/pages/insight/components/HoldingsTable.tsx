import { formatCurrency } from '@l2beat/shared-pure'
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
import { BackingCell } from './BackingCell'

export function HoldingsTable({ holdings }: { holdings: InsightHolding[] }) {
  if (holdings.length === 0) {
    return (
      <p className="text-paragraph-15 text-secondary">
        No balance in any token of our token database.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHead>#</TableHead>
          <TableHead>Token</TableHead>
          <TableHead align="right">Balance</TableHead>
          <TableHead align="right">Value</TableHead>
          <TableHead>Backing</TableHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {holdings.map((holding, i) => (
          <HoldingRow key={holding.address} holding={holding} index={i} />
        ))}
      </TableBody>
    </Table>
  )
}

function HoldingRow({
  holding,
  index,
}: {
  holding: InsightHolding
  index: number
}) {
  const amount = Number(holding.balance) / 10 ** holding.decimals
  return (
    <TableRow highlightId={undefined}>
      <TableCell className="text-secondary">{index + 1}</TableCell>
      <TableCell>
        <TokenName holding={holding} />
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatTokenAmount(amount, holding.valueUsd ?? undefined)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {holding.valueUsd === null ? (
          <span className="text-secondary">No price</span>
        ) : (
          formatCurrency(holding.valueUsd, 'usd')
        )}
      </TableCell>
      <TableCell className="whitespace-normal py-2">
        <BackingCell backing={holding.backing} />
      </TableCell>
    </TableRow>
  )
}

function TokenName({ holding }: { holding: InsightHolding }) {
  return (
    <div className="flex items-center gap-2">
      {holding.iconUrl ? (
        <img
          src={holding.iconUrl}
          alt=""
          width={24}
          height={24}
          className="size-6 rounded-full"
        />
      ) : (
        <div className="size-6 rounded-full bg-surface-tertiary" />
      )}
      <div className="flex flex-col">
        <span className="font-bold">
          {holding.symbol}
          {!holding.reviewed && (
            <span className="ml-1.5 font-normal text-secondary text-xs">
              unreviewed
            </span>
          )}
        </span>
        <span className="text-secondary text-xs">
          {holding.issuer ? `Issued by ${holding.issuer}` : 'Issuer unknown'}
          {' · '}
          {holding.address === 'native' ? (
            'Native'
          ) : (
            <EtherscanLink address={holding.address} />
          )}
        </span>
      </div>
    </div>
  )
}
