import type { IRpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export type DepositsRpc = Pick<IRpcClient, 'getLogs'>

/** First slot of Electra (epoch 364032), which added the pending deposit queue. */
export const ELECTRA_SLOT = 364032 * 32

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

/** Blocks in a day at 12-second slots, a step of the search for older deposits. */
const BLOCKS_PER_DAY = 7200
/** Days back a queued deposit is looked for before the day fails. */
const MAX_QUEUE_DAYS = 7

const GWEI = 10n ** 9n

/**
 * What the beacon chain credited between the states that start and end a day:
 * the queued deposits its counter moved over, and the day's deposits it took
 * in their own block.
 */
export async function readCreditedDeposits(
  rpc: DepositsRpc,
  blocks: { from: number; to: number },
  counter: { start: number; end: number },
): Promise<bigint> {
  const today = await readDeposits(rpc, blocks.from, blocks.to)
  const isQueued = (d: { index: number }) =>
    d.index >= counter.start && d.index < counter.end
  const queued = today.filter(isQueued)
  // The queue lags 7 to 14 hours, so the rest were deposited by yesterday,
  // unless eth1 voting stalled; then older days are searched, a day at a time.
  let end = blocks.from - 1
  for (
    let days = 0;
    queued.length < counter.end - counter.start &&
    days < MAX_QUEUE_DAYS &&
    end >= 0;
    days++
  ) {
    const start = Math.max(0, end - BLOCKS_PER_DAY + 1)
    queued.push(...(await readDeposits(rpc, start, end)).filter(isQueued))
    end = start - 1
  }
  if (queued.length !== counter.end - counter.start) {
    throw new Error('Credited deposits not found', {
      cause: { counter, found: queued.length },
    })
  }
  const direct = today.filter((d) => d.index >= DEPOSIT_REQUESTS_START_INDEX)
  return [...queued, ...direct].reduce((sum, d) => sum + d.amount, 0n)
}

async function readDeposits(
  rpc: DepositsRpc,
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
