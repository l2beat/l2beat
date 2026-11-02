import type { Logger } from '@l2beat/backend-tools'
import type { DuneQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type ExecutionDayDune = Pick<DuneQueryService, 'query'>

export interface ExecutionDay {
  /** Validator withdrawals paid in the blocks, wei. */
  withdrawals: bigint
  /** What builders paid proposers, in the blocks with a builder payment, wei. */
  builderPayments: bigint
  /** Priority fees of the other blocks, which their proposers kept, wei. */
  priorityFees: bigint
  /** ETH sent to the fee recipient in its own transactions, in the other blocks, wei. */
  directTransfers: bigint
  blockCount: number
  builderBlockCount: number
}

const GWEI = 10n ** 9n

/**
 * Builder payments above 50 ETH are logged. A self-built block whose fee
 * recipient last sends ETH anywhere passes for a builder block, and its
 * transfer for the proposer's reward.
 */
const LARGE_BUILDER_PAYMENT_WEI = '50000000000000000000'

const DuneExecutionDayRow = v.object({
  blocks: v.number(),
  first_block: v.union([v.number(), v.null()]),
  last_block: v.union([v.number(), v.null()]),
  incomplete_blocks: v.number(),
  builder_blocks: v.number(),
  large_builder_payment_blocks: v.union([v.array(v.number()), v.null()]),
  builder_payments: v.string(),
  priority_fees: v.string(),
  direct_transfers: v.string(),
  withdrawal_count: v.number(),
  withdrawal_span: v.union([v.number(), v.null()]),
  first_withdrawal_block: v.union([v.number(), v.null()]),
  last_withdrawal_block: v.union([v.number(), v.null()]),
  withdrawals_gwei: v.string(),
})
type DuneExecutionDayRow = v.infer<typeof DuneExecutionDayRow>

/**
 * Sums the execution side of staking over blocks `fromBlock` to `toBlock`,
 * the blocks of the UTC `day`, in one Dune query. Reading the blocks over
 * RPC took about 9,000 calls a day; the sums matched to the wei.
 *
 * Dune fills its tables minutes after the chain, and each table on its own,
 * so the day fails unless every part of it is there: each block, each
 * block's transactions (their gas adds up to the block's), and withdrawals
 * with no gap in their index from the first block to the last. Every block
 * since 2024 has withdrawals, so a day whose first or last block has none
 * is taken as not yet loaded.
 */
export async function readExecutionDayFromDune(
  dune: ExecutionDayDune,
  logger: Logger,
  day: UnixTime,
  fromBlock: number,
  toBlock: number,
): Promise<ExecutionDay> {
  const rows = await dune.query(
    getExecutionDaySql(day, fromBlock, toBlock),
    'medium',
    v.array(DuneExecutionDayRow),
  )
  const row = rows[0]
  if (
    rows.length !== 1 ||
    row === undefined ||
    !isComplete(row, fromBlock, toBlock)
  ) {
    throw new Error('Dune execution day incomplete', {
      cause: { day, fromBlock, toBlock, row },
    })
  }

  if (row.large_builder_payment_blocks?.length) {
    logger.warn('Large builder payments', {
      day,
      blocks: row.large_builder_payment_blocks,
    })
  }

  return {
    withdrawals: BigInt(row.withdrawals_gwei) * GWEI,
    builderPayments: BigInt(row.builder_payments),
    priorityFees: BigInt(row.priority_fees),
    directTransfers: BigInt(row.direct_transfers),
    blockCount: row.blocks,
    builderBlockCount: row.builder_blocks,
  }
}

function isComplete(
  row: DuneExecutionDayRow,
  fromBlock: number,
  toBlock: number,
): boolean {
  return (
    row.blocks === toBlock - fromBlock + 1 &&
    row.first_block === fromBlock &&
    row.last_block === toBlock &&
    row.incomplete_blocks === 0 &&
    row.withdrawal_count === row.withdrawal_span &&
    row.first_withdrawal_block === fromBlock &&
    row.last_withdrawal_block === toBlock
  )
}

/**
 * One row of sums. Per block:
 * - A builder block is one whose last transaction is sent by the fee
 *   recipient with value. Its proposer is that transaction's recipient, and
 *   the builder payment is everything the fee recipient sent it in the block,
 *   reverted or not.
 * - Otherwise the fee recipient is the proposer. It keeps the priority fees,
 *   gas used × (effective gas price − base fee), and ETH others send it in
 *   successful transactions of their own.
 */
export function getExecutionDaySql(
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
