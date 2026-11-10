import { UnixTime } from '@l2beat/shared-pure'

/**
 * Builder payments above 50 ETH are listed, to be logged. A self-built block whose fee
 * recipient last sends ETH anywhere passes for a builder block, and its
 * transfer for the proposer's reward.
 */
const LARGE_BUILDER_PAYMENT_WEI = '50000000000000000000'

/**
 * One row of sums. Per block:
 * - A builder block is one whose last transaction is sent by the fee
 *   recipient with value. Its proposer is that transaction's recipient, and
 *   the builder payment is everything the fee recipient sent it in the block,
 *   reverted or not.
 * - Otherwise the fee recipient is the proposer. It keeps the priority fees,
 *   gas used × (effective gas price − base fee), and ETH others send it in
 *   successful transactions of their own.
 *
 * It takes builders to pay proposers on the execution layer, which holds
 * until ePBS; SUPPORTED_FORK_VERSIONS stops the indexer before then.
 */
export function getExecutionDayQuery(
  day: UnixTime,
  fromBlock: number,
  toBlock: number,
): string {
  // Dates are partitions, so they keep the scan to the day; blocks decide.
  const date = `date '${UnixTime.toYYYYMMDD(day)}'`
  const blocks = `between ${fromBlock} and ${toBlock}`
  return `
with b as (
  select number, miner, base_fee_per_gas, gas_used
  from ethereum.blocks
  where date = ${date} and number ${blocks}
),
t as (
  select block_number, index, "from", "to", value, success, gas_used, gas_price
  from ethereum.transactions
  where block_date = ${date} and block_number ${blocks}
),
w as (
  select block_number, index, amount
  from ethereum.withdrawals
  where block_date = ${date} and block_number ${blocks}
),
last_tx as (
  select block_number,
    max_by("from", index) as sender,
    max_by("to", index) as recipient,
    max_by(value, index) as value
  from t
  group by block_number
),
per_block as (
  select b.number,
    coalesce(
      l.sender = b.miner and l.recipient is not null and l.value > 0,
      false
    ) as builder,
    sum(if(t."from" = b.miner and t."to" = l.recipient, t.value, 0)) as builder_payment,
    sum(cast(t.gas_used as decimal(38, 0)) * (t.gas_price - b.base_fee_per_gas)) as priority_fees,
    sum(if(t."to" = b.miner and t."from" <> b.miner and t.success, t.value, 0)) as direct_transfers,
    coalesce(sum(t.gas_used), 0) = b.gas_used as complete
  from b
  left join last_tx l on l.block_number = b.number
  left join t on t.block_number = b.number
  group by b.number, b.miner, b.gas_used, l.sender, l.recipient, l.value
),
execution as (
  select
    count(*) as blocks,
    min(number) as first_block,
    max(number) as last_block,
    count_if(not complete) as incomplete_blocks,
    count_if(builder) as builder_blocks,
    array_agg(number) filter (
      where builder and builder_payment > decimal '${LARGE_BUILDER_PAYMENT_WEI}'
    ) as large_builder_payment_blocks,
    coalesce(sum(if(builder, builder_payment, 0)), 0) as builder_payments,
    coalesce(sum(if(builder, 0, coalesce(priority_fees, 0))), 0) as priority_fees,
    coalesce(sum(if(builder, 0, direct_transfers)), 0) as direct_transfers
  from per_block
),
withdrawals as (
  select
    count(*) as withdrawal_count,
    max(index) - min(index) + 1 as withdrawal_span,
    min(block_number) as first_withdrawal_block,
    max(block_number) as last_withdrawal_block,
    coalesce(sum(amount), 0) as withdrawals_gwei
  from w
)
select
  blocks, first_block, last_block, incomplete_blocks, builder_blocks,
  large_builder_payment_blocks,
  cast(builder_payments as varchar) as builder_payments,
  cast(priority_fees as varchar) as priority_fees,
  cast(direct_transfers as varchar) as direct_transfers,
  withdrawal_count, withdrawal_span, first_withdrawal_block, last_withdrawal_block,
  cast(withdrawals_gwei as varchar) as withdrawals_gwei
from execution cross join withdrawals
`
}
