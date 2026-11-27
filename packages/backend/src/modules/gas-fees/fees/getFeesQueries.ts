import { gasFeesTokenOf, UnixTime } from '@l2beat/shared-pure'
import type { GasFeesChain } from './chains'
import { GAS_TOKENS } from './feeRules'

/**
 * Fees per chain and day, from `fromDay` to `toDay`, both included: every
 * transaction's fee by its chain's rules, in USD at Dune's price for the hour.
 *
 * The base fee is the block's, on the gas of the transactions that paid:
 * - not what they paid per gas, which holds their tips too. Arbitrum has taken
 *   tips since September 2026, and they are 40% of what its transactions pay;
 * - not on the gas of those that pay nothing: an OP Stack chain's deposits use
 *   gas, 40% of Mantle's, for free.
 */
export function getFeesQuery(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): string {
  const from = UnixTime.toYYYYMMDD(fromDay)
  const end = UnixTime.toYYYYMMDD(UnixTime(toDay + UnixTime.DAY))
  const tokens = Object.entries(GAS_TOKENS)
  // The chains' transactions are put together before the prices are joined:
  // joined per chain, Dune reads the prices once for each and bills them all
  return `
with prices as (
  select
    timestamp as hour,
    case contract_address ${tokens.map(([token, address]) => `when ${address} then '${token}'`).join(' ')} end as token,
    price
  from prices.hour
  where blockchain = 'ethereum'
    and contract_address in (${tokens.map(([, address]) => address).join(', ')})
    and timestamp >= timestamp '${from} 00:00'
    and timestamp < timestamp '${end} 00:00'
), transactions as (${chains
    .map(
      (chain) => `
  select
    '${chain.dune}' as blockchain,
    '${gasFeesTokenOf(chain.id)}' as token,
    t.block_date as day,
    date_trunc('hour', t.block_time) as hour,
    ${chain.fees.fee} as fee,
    ${chain.fees.l1Fee ?? '0e0'} as l1_fee,
    ${chain.fees.blobFee ?? '0e0'} as blob_fee,
    cast(t.gas_used as double) as gas,
    cast(b.base_fee_per_gas as double) as base_fee_per_gas
  from ${chain.dune}.transactions as t
  join ${chain.dune}.blocks as b
    on b.number = t.block_number and ${dateRange('b.date', fromDay, toDay)}
  where ${dateRange('t.block_date', fromDay, toDay)}`,
    )
    .join('\n  union all')}
)
select
  t.blockchain,
  cast(t.day as varchar) as day,
  count_if(fee > 0) as tx_count,
  sum(fee) / 1e18 as total_fee,
  coalesce(sum(fee * price), 0) / 1e18 as total_fee_usd,
  sum(l1_fee) / 1e18 as l1_fee,
  sum(blob_fee) / 1e18 as blob_fee,
  approx_percentile(fee * price / 1e18, 0.5) filter (where fee > 0) as median_fee_usd,
  count_if(fee > 0 and price is null) as unpriced,
  sum(gas) as gas_used,
  sum(if(fee > 0, 0e0, gas)) as free_gas,
  sum(if(fee > 0, base_fee_per_gas * gas, 0e0)) / 1e18 as base_fee
from transactions as t
left join prices as p on p.hour = t.hour and p.token = t.token
group by 1, 2
`
}

/**
 * How far either side of the days the blocks tables are read, for the blocks a
 * day should follow and run into. Past the adjacent days, so that the days
 * around a chain's halt of up to this long are checked against each other.
 * The blocks tables are cheap to read.
 */
const NEIGHBOUR_DAYS = 30

/**
 * The blocks to check a day against, per chain and day: their count, range and
 * gas, from `fromDay` to `toDay` and NEIGHBOUR_DAYS either side.
 */
export function getBlocksQuery(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): string {
  const neighboursFrom = UnixTime(fromDay - NEIGHBOUR_DAYS * UnixTime.DAY)
  const neighboursTo = UnixTime(toDay + NEIGHBOUR_DAYS * UnixTime.DAY)
  return chains
    .map(
      (chain) => `
select
  '${chain.dune}' as blockchain,
  cast(date as varchar) as day,
  sum(cast(gas_used as double)) as gas_used,
  count(*) as blocks,
  min(number) as first_block,
  max(number) as last_block
from ${chain.dune}.blocks
where ${dateRange('date', neighboursFrom, neighboursTo)}
group by 2`,
    )
    .join('\nunion all')
}

// Literal dates, so Dune reads only their partitions
function dateRange(column: string, fromDay: UnixTime, toDay: UnixTime) {
  return `${column} between date '${UnixTime.toYYYYMMDD(fromDay)}' and date '${UnixTime.toYYYYMMDD(toDay)}'`
}
