import { UnixTime } from '@l2beat/shared-pure'

/**
 * Builder payments above 50 ETH are listed, to be logged. A self-built block whose fee
 * recipient last sends ETH anywhere passes for a builder block, and its
 * transfer for the proposer's reward.
 */
const LARGE_BUILDER_PAYMENT_WEI = '50000000000000000000'

/**
 * One row: the sums over the blocks Dune has in full, and the numbers of the
 * others. Per block:
 * - A builder block is one whose last transaction is sent by the fee
 *   recipient with value. Its proposer is that transaction's recipient, and
 *   the builder payment is everything the fee recipient sent it in the block,
 *   reverted or not.
 * - Otherwise the fee recipient is the proposer. It keeps the priority fees,
 *   gas used × (effective gas price − base fee), and ETH others send it in
 *   successful transactions of their own.
 *
 * Dune fills its tables minutes after the chain, each on its own, and has
 * lost a block's transactions and withdrawals for good (block 26406452). A
 * block counts as there when its header is, its transactions' gas adds up to
 * the block's, and its withdrawals run on without a gap from the nearest
 * block before and after it that has any. A block with none, or with no such
 * neighbour inside the day, is missing; reading it elsewhere costs a call.
 * The day's first and last blocks have no neighbour to check their outer
 * ends against, as before.
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
with n as (
  select number from unnest(sequence(${fromBlock}, ${toBlock})) as s(number)
),
b as (
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
  select block_number,
    count(*) as withdrawal_count,
    min(index) as first_index,
    max(index) as last_index,
    sum(amount) as gwei
  from ethereum.withdrawals
  where block_date = ${date} and block_number ${blocks}
  group by block_number
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
    coalesce(sum(t.gas_used), 0) = b.gas_used as transactions_complete
  from b
  left join last_tx l on l.block_number = b.number
  left join t on t.block_number = b.number
  group by b.number, b.miner, b.gas_used, l.sender, l.recipient, l.value
),
linked as (
  select n.number, w.withdrawal_count, w.first_index, w.last_index, w.gwei,
    lag(w.last_index) ignore nulls over (order by n.number) as previous_last_index,
    lead(w.first_index) ignore nulls over (order by n.number) as next_first_index
  from n
  left join w on w.block_number = n.number
),
checked as (
  select l.number, p.builder, p.builder_payment, p.priority_fees,
    p.direct_transfers, l.gwei,
    coalesce(
      p.transactions_complete
        and l.withdrawal_count = l.last_index - l.first_index + 1
        and coalesce(l.first_index = l.previous_last_index + 1, l.number = ${fromBlock})
        and coalesce(l.last_index = l.next_first_index - 1, l.number = ${toBlock}),
      false
    ) as complete
  from linked l
  left join per_block p on p.number = l.number
)
select
  count_if(complete) as blocks,
  count_if(complete and builder) as builder_blocks,
  array_agg(number) filter (
    where complete and builder
      and builder_payment > decimal '${LARGE_BUILDER_PAYMENT_WEI}'
  ) as large_builder_payment_blocks,
  cast(coalesce(sum(if(complete and builder, builder_payment, 0)), 0) as varchar) as builder_payments,
  cast(coalesce(sum(if(complete and not builder, priority_fees, 0)), 0) as varchar) as priority_fees,
  cast(coalesce(sum(if(complete and not builder, direct_transfers, 0)), 0) as varchar) as direct_transfers,
  cast(coalesce(sum(if(complete, gwei, 0)), 0) as varchar) as withdrawals_gwei,
  array_agg(number order by number) filter (where not complete) as missing_blocks
from checked
`
}
