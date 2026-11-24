import type { Logger } from '@l2beat/backend-tools'
import type { DuneQueryService } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { ExecutionDay } from '../executionDay'
import { getExecutionDayQuery } from './getExecutionDayQuery'

export type ExecutionDayDune = Pick<DuneQueryService, 'query'>

const GWEI = 10n ** 9n

const DuneExecutionDayRow = v.object({
  blocks: v.number(),
  builder_blocks: v.number(),
  large_builder_payment_blocks: v.union([v.array(v.number()), v.null()]),
  builder_payments: v.string(),
  priority_fees: v.string(),
  direct_transfers: v.string(),
  withdrawals_gwei: v.string(),
  missing_blocks: v.union([v.array(v.number()), v.null()]),
})

/**
 * Sums the execution side of staking over the blocks of the UTC `day`,
 * `fromBlock` to `toBlock`, in one Dune query: the blocks Dune has in full,
 * and the numbers of the ones it's missing, to be read elsewhere.
 */
export async function readDuneExecutionDay(
  dune: ExecutionDayDune,
  logger: Logger,
  day: UnixTime,
  fromBlock: number,
  toBlock: number,
): Promise<{ execution: ExecutionDay; missingBlocks: number[] }> {
  const rows = await dune.query(
    getExecutionDayQuery(day, fromBlock, toBlock),
    'medium',
    v.array(DuneExecutionDayRow),
  )
  const row = rows[0]
  const missingBlocks = row?.missing_blocks ?? []
  if (
    rows.length !== 1 ||
    row === undefined ||
    row.blocks + missingBlocks.length !== toBlock - fromBlock + 1
  ) {
    throw new Error('Dune execution day malformed', {
      cause: { day, fromBlock, toBlock, rows },
    })
  }

  if (row.large_builder_payment_blocks?.length) {
    logger.warn('Large builder payments', {
      day,
      blocks: row.large_builder_payment_blocks,
    })
  }

  return {
    execution: {
      withdrawals: BigInt(row.withdrawals_gwei) * GWEI,
      builderPayments: BigInt(row.builder_payments),
      priorityFees: BigInt(row.priority_fees),
      directTransfers: BigInt(row.direct_transfers),
      blockCount: row.blocks,
      builderBlockCount: row.builder_blocks,
    },
    missingBlocks,
  }
}
