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
  /** What the blocks' proposers earned, wei. */
  executionRewards: bigint
  blockCount: number
}

const DEPOSIT_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa'
const depositInterface = new utils.Interface([
  'event DepositEvent(bytes pubkey, bytes withdrawal_credentials, bytes amount, bytes signature, bytes index)',
])
const DEPOSIT_EVENT_TOPIC = depositInterface.getEventTopic('DepositEvent')
/**
 * The index of the first deposit after Electra. Earlier deposits were
 * credited 7 to 14 hours late, in index order; from this one on, each is
 * credited in its own block.
 */
const DEPOSIT_REQUESTS_START_INDEX = 2_045_126

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

  return {
    withdrawals,
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
    ) + getDirectTransfers(block)
  return { withdrawals, proposerReward }
}

/**
 * ETH sent to the fee recipient in its own transactions, such as a searcher
 * paying for inclusion. Payments made inside contract calls need traces, so
 * they are not counted.
 */
export function getDirectTransfers(
  block: Pick<EVMBlockWithTransactions, 'miner' | 'transactions'>,
): bigint {
  const miner = block.miner?.toLowerCase()
  if (miner === undefined) return 0n
  return block.transactions.reduce(
    (sum, tx) =>
      tx.to?.toLowerCase() === miner && tx.from.toLowerCase() !== miner
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

/**
 * What the beacon chain credited between the states that start and end a day:
 * the queued deposits its counter moved over, and the day's deposits it took
 * in their own block.
 */
export async function readCreditedDeposits(
  rpc: Pick<ExecutionDayRpc, 'getLogs'>,
  blocks: { previousDayFrom: number; from: number; to: number },
  counter: { start: number; end: number },
): Promise<bigint> {
  const today = await readDeposits(rpc, blocks.from, blocks.to)
  // The queue lags less than a day, so what it took was deposited by yesterday.
  const yesterday =
    counter.end > counter.start
      ? await readDeposits(rpc, blocks.previousDayFrom, blocks.from - 1)
      : []
  const queued = [...yesterday, ...today].filter(
    (d) => d.index >= counter.start && d.index < counter.end,
  )
  if (queued.length !== counter.end - counter.start) {
    throw new Error('Credited deposits not found', {
      cause: { counter, found: queued.length },
    })
  }
  const direct = today.filter((d) => d.index >= DEPOSIT_REQUESTS_START_INDEX)
  return [...queued, ...direct].reduce((sum, d) => sum + d.amount, 0n)
}

async function readDeposits(
  rpc: Pick<ExecutionDayRpc, 'getLogs'>,
  fromBlock: number,
  toBlock: number,
) {
  const logs = await rpc.getLogs(
    fromBlock,
    toBlock,
    [DEPOSIT_CONTRACT],
    [[DEPOSIT_EVENT_TOPIC]],
  )
  return logs.map(decodeDeposit)
}

/** The amount, in gwei, and the index are 8 bytes each, little-endian. */
export function decodeDeposit(log: { topics: string[]; data: string }): {
  amount: bigint
  index: number
} {
  const { args } = depositInterface.parseLog(log)
  const amount = Buffer.from((args.amount as string).slice(2), 'hex')
  const index = Buffer.from((args.index as string).slice(2), 'hex')
  assert(
    amount.length === 8 && index.length === 8,
    'Unexpected deposit field length',
  )
  return {
    amount: amount.readBigUInt64LE(0) * GWEI,
    index: Number(index.readBigUInt64LE(0)),
  }
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}
