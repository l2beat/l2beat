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
  approx_percentile(tx_fee_usd, 0.5) filter (where tx_fee > 0) as median_fee_usd
from gas.fees
where ${dateRange('block_date', fromDay, toDay)}
  and blockchain in (${chains.map((c) => `'${c.dune}'`).join(', ')})
group by 1, 2
`
}

/** Base fee and gas used per chain and day, from `fromDay` to `toDay`, both included */
export function getBlocksQuery(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): string {
  return chains
    .map((chain) =>
      chain.gasFromTransactions
        ? // Its tips are ignored, so a transaction pays the base fee on all its gas, the gas charged for L1 data included
          `
select
  '${chain.dune}' as blockchain,
  cast(block_date as varchar) as day,
  sum(cast(effective_gas_price as double) * cast(gas_used as double)) / 1e18 as base_fee,
  sum(cast(gas_used as double)) as gas_used
from ${chain.dune}.transactions
where ${dateRange('block_date', fromDay, toDay)}
group by 2`
        : `
select
  '${chain.dune}' as blockchain,
  cast(date as varchar) as day,
  sum(cast(base_fee_per_gas as double) * gas_used) / 1e18 as base_fee,
  sum(cast(gas_used as double)) as gas_used
from ${chain.dune}.blocks
where ${dateRange('date', fromDay, toDay)}
group by 2`,
    )
    .join('\nunion all')
}

// Literal dates, so Dune reads only their partitions
function dateRange(column: string, fromDay: UnixTime, toDay: UnixTime) {
  return `${column} between date '${UnixTime.toYYYYMMDD(fromDay)}' and date '${UnixTime.toYYYYMMDD(toDay)}'`
}
