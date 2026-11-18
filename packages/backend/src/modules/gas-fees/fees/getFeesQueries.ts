import { UnixTime } from '@l2beat/shared-pure'
import type { GasFeesChain } from './chains'

/**
 * Fees per chain and day, from `fromDay` to `toDay`, both included. Kept apart
 * from the blocks query: joined inside Dune they went over the credit cap.
 */
export function getFeesQuery(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): string {
  // Legacy transactions have no priority_fee key, so the base fee comes from blocks.
  // element_at, as reading a missing key with [] throws. tx_fee_raw > 0 throws on some chains.
  return `
select
  blockchain,
  cast(block_date as varchar) as day,
  count_if(tx_fee > 0) as tx_count,
  sum(tx_fee) as total_fee,
  sum(tx_fee_usd) as total_fee_usd,
  sum(coalesce(element_at(tx_fee_breakdown, 'l1_fee'), 0)) as l1_fee,
  sum(coalesce(element_at(tx_fee_breakdown, 'blob_fee'), 0)) as blob_fee,
  approx_percentile(tx_fee_usd, 0.5) filter (where tx_fee > 0) as median_fee_usd,
  sum(cast(gas_used as double)) as gas_used
from gas.fees
where ${dateRange('block_date', fromDay, toDay)}
  and blockchain in (${chains.map((c) => `'${c.dune}'`).join(', ')})
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
 * Base fee and gas used per chain and day, from `fromDay` to `toDay`, both
 * included, with the blocks to check a day against: their count and range from
 * the blocks table. The range is read for NEIGHBOUR_DAYS either side too.
 *
 * The base fee is what transactions paid, so not on the gas of those that pay
 * nothing: an OP Stack chain's deposits use gas, 40% of Mantle's, for free.
 */
export function getBlocksQuery(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): string {
  const neighboursFrom = UnixTime(fromDay - NEIGHBOUR_DAYS * UnixTime.DAY)
  const neighboursTo = UnixTime(toDay + NEIGHBOUR_DAYS * UnixTime.DAY)
  return chains
    .map((chain) =>
      chain.gasFromTransactions
        ? // Its tips are ignored, so a transaction pays the base fee on all its gas, the gas charged for L1 data included
          `
select
  '${chain.dune}' as blockchain,
  b.day,
  t.base_fee,
  t.gas_used,
  cast(0 as double) as free_gas,
  t.tx_blocks,
  b.blocks,
  b.first_block,
  b.last_block
from (
  select
    cast(date as varchar) as day,
    count(*) as blocks,
    min(number) as first_block,
    max(number) as last_block
  from ${chain.dune}.blocks
  where ${dateRange('date', neighboursFrom, neighboursTo)}
  group by 1
) as b
left join (
  select
    cast(block_date as varchar) as day,
    sum(cast(effective_gas_price as double) * cast(gas_used as double)) / 1e18 as base_fee,
    sum(cast(gas_used as double)) as gas_used,
    count(distinct block_number) as tx_blocks
  from ${chain.dune}.transactions
  where ${dateRange('block_date', fromDay, toDay)}
  group by 1
) as t on t.day = b.day`
        : `
select
  '${chain.dune}' as blockchain,
  cast(b.date as varchar) as day,
  sum(cast(b.base_fee_per_gas as double) * (b.gas_used - coalesce(f.gas_used, 0))) / 1e18 as base_fee,
  sum(cast(b.gas_used as double)) as gas_used,
  sum(cast(coalesce(f.gas_used, 0) as double)) as free_gas,
  cast(null as bigint) as tx_blocks,
  count(*) as blocks,
  min(b.number) as first_block,
  max(b.number) as last_block
from ${chain.dune}.blocks as b
left join (
  select block_number, sum(gas_used) as gas_used
  from ${chain.dune}.transactions
  where ${dateRange('block_date', fromDay, toDay)}
    and gas_price = 0
  group by 1
) as f on f.block_number = b.number
where ${dateRange('b.date', neighboursFrom, neighboursTo)}
group by 2`,
    )
    .join('\nunion all')
}

// Literal dates, so Dune reads only their partitions
function dateRange(column: string, fromDay: UnixTime, toDay: UnixTime) {
  return `${column} between date '${UnixTime.toYYYYMMDD(fromDay)}' and date '${UnixTime.toYYYYMMDD(toDay)}'`
}
