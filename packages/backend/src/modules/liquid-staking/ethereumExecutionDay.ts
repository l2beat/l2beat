import type { Logger } from '@l2beat/backend-tools'
import type {
  EVMBlockWithTransactions,
  IRpcClient,
  Receipt,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export type ExecutionDayRpc = Pick<
  IRpcClient,
  'getBlockWithTransactions' | 'getBlockReceipts'
>

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

/** Blocks read at once: enough to keep the RPC busy, few enough to fit in memory. */
const BLOCKS_PER_BATCH = 50

/**
 * Builder payments above this are logged. A self-built block whose fee
 * recipient last sends ETH anywhere passes for a builder block, and its
 * transfer for the proposer's reward.
 */
const LARGE_BUILDER_PAYMENT = 50n * 10n ** 18n

const GWEI = 10n ** 9n

/** Sums the execution side of staking over blocks `fromBlock` to `toBlock`, inclusive. */
export async function readExecutionDay(
  rpc: ExecutionDayRpc,
  logger: Logger,
  fromBlock: number,
  toBlock: number,
): Promise<ExecutionDay> {
  const day: ExecutionDay = {
    withdrawals: 0n,
    builderPayments: 0n,
    priorityFees: 0n,
    directTransfers: 0n,
    blockCount: toBlock - fromBlock + 1,
    builderBlockCount: 0,
  }
  for (let start = fromBlock; start <= toBlock; start += BLOCKS_PER_BATCH) {
    const end = Math.min(start + BLOCKS_PER_BATCH - 1, toBlock)
    const blocks = await Promise.all(
      range(start, end).map((n) => readBlock(rpc, n)),
    )
    for (const block of blocks) {
      day.withdrawals += block.withdrawals
      if (block.builderPayment !== undefined) {
        day.builderPayments += block.builderPayment
        day.builderBlockCount++
        if (block.builderPayment > LARGE_BUILDER_PAYMENT) {
          logger.warn('Large builder payment', {
            block: block.number,
            wei: block.builderPayment.toString(),
          })
        }
      } else {
        day.priorityFees += block.priorityFees
        day.directTransfers += block.directTransfers
      }
    }
  }
  return day
}

async function readBlock(rpc: ExecutionDayRpc, blockNumber: number) {
  const block = await rpc.getBlockWithTransactions(blockNumber)
  assert(
    block.baseFeePerGas !== undefined && block.withdrawals !== undefined,
    'Block without a base fee or withdrawals',
  )
  const withdrawals = block.withdrawals.reduce(
    (sum, w) => sum + w.amount * GWEI,
    0n,
  )
  const builderPayment = getBuilderPayment(block)
  if (builderPayment !== undefined) {
    return {
      number: blockNumber,
      withdrawals,
      builderPayment,
      priorityFees: 0n,
      directTransfers: 0n,
    }
  }
  const receipts = await rpc.getBlockReceipts(blockNumber)
  return {
    number: blockNumber,
    withdrawals,
    builderPayment,
    priorityFees: getPriorityFees(block.baseFeePerGas, receipts),
    directTransfers: getDirectTransfers(block, receipts),
  }
}

/**
 * ETH sent to the fee recipient in its own transactions, such as a searcher
 * paying for inclusion. A reverted transaction moves no ETH. Payments made
 * inside contract calls need traces, so they are not counted.
 */
export function getDirectTransfers(
  block: Pick<EVMBlockWithTransactions, 'miner' | 'transactions'>,
  receipts: Pick<Receipt, 'status'>[],
): bigint {
  const miner = block.miner?.toLowerCase()
  if (miner === undefined) return 0n
  assert(
    receipts.length === block.transactions.length,
    'Receipts do not match the block',
  )
  return block.transactions.reduce(
    (sum, tx, i) =>
      tx.to?.toLowerCase() === miner &&
      tx.from.toLowerCase() !== miner &&
      receipts[i]?.status !== 0
        ? sum + (tx.value ?? 0n)
        : sum,
    0n,
  )
}

/**
 * A builder that keeps the fees pays the proposer from the fee recipient, in
 * the block's last transaction and sometimes in earlier ones too.
 */
export function getBuilderPayment(
  block: Pick<EVMBlockWithTransactions, 'miner' | 'transactions'>,
): bigint | undefined {
  const last = block.transactions.at(-1)
  const builder = block.miner?.toLowerCase()
  const proposer = last?.to?.toLowerCase()
  if (
    last === undefined ||
    builder === undefined ||
    proposer === undefined ||
    last.from.toLowerCase() !== builder ||
    !last.value
  ) {
    return undefined
  }
  return block.transactions.reduce(
    (sum, tx) =>
      tx.from.toLowerCase() === builder && tx.to?.toLowerCase() === proposer
        ? sum + (tx.value ?? 0n)
        : sum,
    0n,
  )
}

/** Without a builder payment, the fee recipient is the proposer and keeps the tips. */
export function getPriorityFees(
  baseFeePerGas: bigint,
  receipts: Pick<Receipt, 'gasUsed' | 'effectiveGasPrice'>[],
): bigint {
  return receipts.reduce((sum, receipt) => {
    assert(
      receipt.gasUsed !== undefined && receipt.effectiveGasPrice !== undefined,
      'Receipt without gas fields',
    )
    return sum + receipt.gasUsed * (receipt.effectiveGasPrice - baseFeePerGas)
  }, 0n)
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}
