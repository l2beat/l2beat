import { formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { Tag, WithTooltip } from './cells'
import {
  formatAmount,
  formatChain,
  type Row,
  type RowValue,
  shortAddress,
} from './rows'

const AMOUNT_GAP_LABELS: Record<NonNullable<RowValue['amountGap']>, string> = {
  nonEvm: 'non-EVM',
  nativeSupply: 'native',
  noEscrows: 'no escrows',
  noRpc: 'no RPC',
  readFailed: 'read failed',
}

// Counted rows are not estimated, so they have no value to show.
export function ValueCell({ row }: { row: Row }) {
  const { value } = row
  if (!value) return null
  if (value.amount === undefined) {
    return (
      <Muted tooltip={describeAmountGap(row, value)}>
        {AMOUNT_GAP_LABELS[value.amountGap ?? 'readFailed']}
      </Muted>
    )
  }
  return (
    <div className="flex flex-col items-end">
      {value.valueUsd === undefined ? (
        <Muted tooltip={describeMissingPrice(row)}>no price</Muted>
      ) : (
        <WithTooltip
          content={`Price ${formatCurrency(value.priceUsd ?? 0, 'usd')} from ${row.pricing?.coingeckoId}`}
        >
          <span className="font-medium">
            {formatCurrency(value.valueUsd, 'usd')}
          </span>
        </WithTooltip>
      )}
      <div className="flex flex-wrap items-center justify-end gap-1 text-muted-foreground text-xs">
        <AmountTags row={row} value={value} />
        <WithTooltip content={<AmountDetails row={row} value={value} />}>
          <span>
            {row.side === 'escrow' && value.amount === 0
              ? 'none in escrows'
              : formatAmount(value.amount)}
          </span>
        </WithTooltip>
      </div>
    </div>
  )
}

function AmountTags({ row, value }: { row: Row; value: RowValue }) {
  const via = row.pricing?.via
  return (
    <>
      {value.amountSource === 'circulatingSupply' && (
        <WithTooltip content="CoinGecko's circulating supply is lower than the token's total supply on this chain, so the value uses the circulating supply.">
          <Tag tone="warning" small>
            capped
          </Tag>
        </WithTooltip>
      )}
      {value.amountSource === 'mintedSupply' && (
        <WithTooltip content="The copy the project's own bridge minted has a larger supply than the listed escrows hold, so the value uses that supply. The rest sits in escrows the TVS config does not list.">
          <Tag tone="warning" small>
            minted supply
          </Tag>
        </WithTooltip>
      )}
      {value.circulatingSupplyUnknown && (
        <WithTooltip content="CoinGecko has no circulating supply for this token, so the value uses its total supply on the chain, which can include a premint, a treasury or locked tokens. A natively minted token needs a CoinGecko circulating supply before TVS can count it.">
          <Tag tone="warning" small>
            uncapped
          </Tag>
        </WithTooltip>
      )}
      {via && (
        <WithTooltip
          content={
            <>
              <div>
                Not listed on CoinGecko, so it is valued at the price of its
                locked counterpart.
              </div>
              <div className="opacity-75">
                {via.symbol} on {formatChain(via.chain)},{' '}
                {shortAddress(via.address)}
              </div>
            </>
          }
        >
          <Tag tone="info" small>
            via {via.symbol}
          </Tag>
        </WithTooltip>
      )}
    </>
  )
}

function AmountDetails({ row, value }: { row: Row; value: RowValue }) {
  if (row.side === 'chain') {
    return value.amountSource === 'circulatingSupply'
      ? "The total supply is above CoinGecko's global circulating supply, so the circulating supply is used."
      : `Total supply: ${value.amount?.toLocaleString('en-US')}`
  }
  const minted = value.mintedCopy
  return (
    <div className="space-y-1">
      <div>
        In {row.escrowAddresses.length} known escrows:{' '}
        {formatOptionalAmount(value.escrowBalance)}
      </div>
      {minted && (
        <div>
          Minted as {minted.symbol ?? shortAddress(minted.address)} on{' '}
          {formatChain(minted.chain)}: {formatOptionalAmount(minted.supply)}
        </div>
      )}
      {value.amountSource === 'mintedSupply' && (
        <div>
          The minted supply is larger and is used. The rest is locked in escrows
          the TVS config does not list.
        </div>
      )}
      {row.escrowAddresses.length > 0 && (
        <div className="font-mono opacity-75">
          {row.escrowAddresses.map((address) => (
            <div key={address}>{address}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function describeAmountGap(row: Row, value: RowValue): string {
  const chain = formatChain(row.chain)
  switch (value.amountGap) {
    case 'nonEvm':
      return 'Only EVM token addresses are read.'
    case 'nativeSupply':
      return "The supply of a chain's native token is not read."
    case 'noEscrows':
      return `The project's TVS config lists no escrows on ${chain}, and there is no minted copy to read.`
    case 'noRpc':
      return `The token DB has no RPC for ${chain}.`
    default:
      return row.side === 'escrow'
        ? `Reading the escrow balances on ${chain} failed.`
        : `Reading totalSupply or decimals on ${chain} failed. The address may not be an ERC-20 token.`
  }
}

function describeMissingPrice(row: Row): string {
  if (row.pricing) {
    return `CoinGecko returned no price for ${row.pricing.coingeckoId}.`
  }
  if (row.coingeckoId) {
    return 'The token DB marks the price of this token as unreliable.'
  }
  return 'The token DB has no CoinGecko id for this token, and there is no locked counterpart to take a price from.'
}

function formatOptionalAmount(amount: number | undefined): string {
  return amount === undefined ? 'not read' : formatAmount(amount)
}

function Muted({
  tooltip,
  children,
}: {
  tooltip: string
  children: ReactNode
}) {
  return (
    <WithTooltip content={tooltip}>
      <span className="text-muted-foreground text-xs">{children}</span>
    </WithTooltip>
  )
}
