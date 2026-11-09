import type { Logger } from '@l2beat/backend-tools'
import type { DuneQueryService } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getExecutionDayQuery } from './getExecutionDayQuery'

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
export async function readExecutionDay(
  dune: ExecutionDayDune,
  logger: Logger,
  day: UnixTime,
  fromBlock: number,
  toBlock: number,
): Promise<ExecutionDay> {
  const rows = await dune.query(
    getExecutionDayQuery(day, fromBlock, toBlock),
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
