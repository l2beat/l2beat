import type { Logger } from '@l2beat/backend-tools'
import type { UnixTime } from '@l2beat/shared-pure'
import {
  type ExecutionDayDune,
  readDuneExecutionDay,
} from './dune/readDuneExecutionDay'
import {
  type ExecutionBlocksRpc,
  readExecutionBlocks,
} from './rpc/readExecutionBlocks'

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

/**
 * Sums the execution side of staking over blocks `fromBlock` to `toBlock`,
 * the blocks of the UTC `day`. Dune sums the day in one query; the blocks it
 * doesn't have in full are read over RPC, about 1.3 calls a block.
 */
export async function readExecutionDay(
  dune: ExecutionDayDune,
  rpc: ExecutionBlocksRpc,
  logger: Logger,
  day: UnixTime,
  fromBlock: number,
  toBlock: number,
): Promise<ExecutionDay> {
  const { execution, missingBlocks } = await readDuneExecutionDay(
    dune,
    logger,
    day,
    fromBlock,
    toBlock,
  )
  if (missingBlocks.length === 0) {
    return execution
  }

  logger.warn('Reading blocks missing on Dune over RPC', {
    day,
    count: missingBlocks.length,
    blocks: missingBlocks.slice(0, 10),
  })
  const fromRpc = await readExecutionBlocks(rpc, logger, day, missingBlocks)
  return {
    withdrawals: execution.withdrawals + fromRpc.withdrawals,
    builderPayments: execution.builderPayments + fromRpc.builderPayments,
    priorityFees: execution.priorityFees + fromRpc.priorityFees,
    directTransfers: execution.directTransfers + fromRpc.directTransfers,
    blockCount: execution.blockCount + fromRpc.blockCount,
    builderBlockCount: execution.builderBlockCount + fromRpc.builderBlockCount,
  }
}
