import type { Logger } from '@l2beat/backend-tools'
import type {
  EVMBlockWithTransactions,
  IRpcClient,
  Receipt,
} from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { ExecutionDay } from '../executionDay'

export type ExecutionBlocksRpc = Pick<
  IRpcClient,
  'getBlockWithTransactions' | 'getBlockReceipts'
>

/** Blocks read at once: enough to keep the RPC busy, few enough to fit in memory. */
const BLOCKS_PER_BATCH = 50

/** The same threshold as the Dune query's. */
const LARGE_BUILDER_PAYMENT = 50n * 10n ** 18n

const GWEI = 10n ** 9n

/**
 * Sums the execution side of staking over `blockNumbers`, by the rules of
 * the Dune query: a block with its transactions, plus its receipts when it
 * has no builder payment.
 */
export async function readExecutionBlocks(
  rpc: ExecutionBlocksRpc,
  logger: Logger,
  day: UnixTime,
  blockNumbers: number[],
): Promise<ExecutionDay> {
  const sums: ExecutionDay = {
    withdrawals: 0n,
    builderPayments: 0n,
    priorityFees: 0n,
    directTransfers: 0n,
    blockCount: blockNumbers.length,
    builderBlockCount: 0,
  }
  const largeBuilderPaymentBlocks: number[] = []
  for (let i = 0; i < blockNumbers.length; i += BLOCKS_PER_BATCH) {
    const blocks = await Promise.all(
      blockNumbers.slice(i, i + BLOCKS_PER_BATCH).map((n) => readBlock(rpc, n)),
    )
    for (const block of blocks) {
      sums.withdrawals += block.withdrawals
      if (block.builderPayment !== undefined) {
        sums.builderPayments += block.builderPayment
        sums.builderBlockCount++
        if (block.builderPayment > LARGE_BUILDER_PAYMENT) {
          largeBuilderPaymentBlocks.push(block.number)
        }
      } else {
        sums.priorityFees += block.priorityFees
        sums.directTransfers += block.directTransfers
      }
    }
  }
  if (largeBuilderPaymentBlocks.length > 0) {
    logger.warn('Large builder payments', {
      day,
      blocks: largeBuilderPaymentBlocks,
    })
  }
  return sums
}

async function readBlock(rpc: ExecutionBlocksRpc, blockNumber: number) {
  const block = await rpc.getBlockWithTransactions(blockNumber)
  assert(
    block.miner !== undefined &&
      block.baseFeePerGas !== undefined &&
      block.withdrawals !== undefined,
    'Block without a fee recipient, base fee or withdrawals',
    { blockNumber },
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
  return block.transactions.reduce((sum, tx, i) => {
    const status = receipts[i]?.status
    assert(status === 0 || status === 1, 'Receipt without status')
    return tx.to?.toLowerCase() === miner &&
      tx.from.toLowerCase() !== miner &&
      status === 1
      ? sum + (tx.value ?? 0n)
      : sum
  }, 0n)
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
