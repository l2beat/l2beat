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

const GWEI = 10n ** 9n

/**
 * What the beacon chain credited between the states that start and end a day:
 * the queued deposits its counter moved over, and the day's deposits it took
 * in their own block.
 */
export async function readCreditedDeposits(
  rpc: DepositsRpc,
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
