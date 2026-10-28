import type {
  EVMBlockWithTransactions,
  IRpcClient,
  Receipt,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export type ExecutionDayRpc = Pick<
  IRpcClient,
  'getBlockWithTransactions' | 'getBlockReceipts' | 'getLogs'
>

export interface ExecutionDay {
  /** Validator withdrawals paid in the blocks, wei. */
  withdrawals: bigint
  /** Deposit contract deposits in the blocks, wei. */
  deposits: bigint
  /** What the blocks' proposers earned, wei. */
  executionRewards: bigint
  blockCount: number
}

const DEPOSIT_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa'
const depositInterface = new utils.Interface([
  'event DepositEvent(bytes pubkey, bytes withdrawal_credentials, bytes amount, bytes signature, bytes index)',
])
const DEPOSIT_EVENT_TOPIC = depositInterface.getEventTopic('DepositEvent')

/** Blocks read at once: enough to keep the RPC busy, few enough to fit in memory. */
const BLOCKS_PER_BATCH = 50

const GWEI = 10n ** 9n

/** Sums the execution side of staking over blocks `fromBlock` to `toBlock`, inclusive. */
export async function readExecutionDay(
  rpc: ExecutionDayRpc,
  fromBlock: number,
  toBlock: number,
): Promise<ExecutionDay> {
  let withdrawals = 0n
  let executionRewards = 0n
  for (let start = fromBlock; start <= toBlock; start += BLOCKS_PER_BATCH) {
    const end = Math.min(start + BLOCKS_PER_BATCH - 1, toBlock)
    const blocks = await Promise.all(
      range(start, end).map((n) => readBlock(rpc, n)),
    )
    for (const block of blocks) {
      withdrawals += block.withdrawals
      executionRewards += block.proposerReward
    }
  }

  const depositLogs = await rpc.getLogs(
    fromBlock,
    toBlock,
    [DEPOSIT_CONTRACT],
    [[DEPOSIT_EVENT_TOPIC]],
  )
  const deposits = depositLogs.reduce(
    (sum, log) => sum + decodeDepositAmount(log),
    0n,
  )

  return {
    withdrawals,
    deposits,
    executionRewards,
    blockCount: toBlock - fromBlock + 1,
  }
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
  const proposerReward =
    getBuilderPayment(block) ??
    getPriorityFees(
      block.baseFeePerGas,
      await rpc.getBlockReceipts(blockNumber),
    )
  return { withdrawals, proposerReward }
}

/**
 * A builder that keeps the fees pays the proposer in the block's last
 * transaction, sent from the fee recipient.
 */
export function getBuilderPayment(
  block: Pick<EVMBlockWithTransactions, 'miner' | 'transactions'>,
): bigint | undefined {
  const last = block.transactions.at(-1)
  if (
    last === undefined ||
    block.miner === undefined ||
    last.from.toLowerCase() !== block.miner.toLowerCase() ||
    !last.value
  ) {
    return undefined
  }
  return last.value
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

/** The amount is 8 bytes of little-endian gwei. */
export function decodeDepositAmount(log: {
  topics: string[]
  data: string
}): bigint {
  const { args } = depositInterface.parseLog(log)
  const amount = Buffer.from((args.amount as string).slice(2), 'hex')
  assert(amount.length === 8, 'Unexpected deposit amount length')
  return amount.readBigUInt64LE(0) * GWEI
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}
