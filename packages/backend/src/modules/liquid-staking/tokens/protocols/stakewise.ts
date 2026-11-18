import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { CallParameters } from '@l2beat/shared'
import type { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { encodeCall, UNIT, uint, word } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, type ProtocolReads, protocolReads } from './types'

const abi = new utils.Interface([
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function getExitQueueData() view returns (uint256 queuedShares, uint256 unclaimedAssets, uint256 totalTickets)',
  'function redeemedShares() view returns (uint128)',
  'function swappedShares() view returns (uint128)',
])

/**
 * The blocks at which OsTokenConfig named each queue as osETH's redeemer.
 * Before the first, the redeemer was the DAO multisig and osETH had no exit
 * queue.
 */
const REDEEMERS = {
  first: 25_896_514,
  second: 26_348_627,
}

/**
 * Queue tickets are osETH shares. The counters are stored in thousandths of
 * an osETH, which keeps them within the database's integers.
 */
const TICKET_UNIT = UNIT / 1000n

/**
 * The rate, and the counters of osETH's exit queues: tickets entered and
 * tickets processed. The first queue was replaced with unpaid shares left in
 * it, which it can still process, so each queue is counted on its own: added
 * up, that leftover would make the newest requests look unpaid. A queue's
 * third value also counts the shares redeemed or bought since its last
 * checkpoint, which holders can only claim after the next one, so those are
 * entered but not yet processed.
 */
export function getStakeWiseReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'stakewise' }>,
  blockNumber: number,
): ProtocolReads {
  const calls: Record<string, CallParameters> = {
    rate: encodeCall(abi, contracts.vaultController, 'convertToAssets', [UNIT]),
  }
  const addQueue = (name: QueueName, queue: ChainSpecificAddress) => {
    calls[`${name}Queue`] = encodeCall(abi, queue, 'getExitQueueData')
    calls[`${name}Redeemed`] = encodeCall(abi, queue, 'redeemedShares')
    calls[`${name}Swapped`] = encodeCall(abi, queue, 'swappedShares')
  }
  if (blockNumber >= REDEEMERS.first) {
    addQueue('retired', contracts.previousRedeemer)
  }
  if (blockNumber >= REDEEMERS.second) {
    addQueue('current', contracts.redeemer)
  }

  return protocolReads<string>({
    token: contracts.osETH,
    saleValue: saleAtRate,
    calls,
    toState: (r) => {
      const current = getQueueCounters(r, 'current')
      const retired = getQueueCounters(r, 'retired')
      return {
        ...EMPTY_EXIT,
        exchangeRate: uint(r.rate as Bytes),
        lastRequestId: current?.entered ?? null,
        lastFinalizedRequestId: current?.processed ?? null,
        retiredLastRequestId: retired?.entered ?? null,
        retiredLastFinalizedRequestId: retired?.processed ?? null,
      }
    },
  })
}

type QueueName = 'current' | 'retired'

/** Nothing for a queue that isn't read at the block. */
function getQueueCounters(
  results: Record<string, Bytes>,
  name: QueueName,
): { entered: number; processed: number } | undefined {
  const data = results[`${name}Queue`]
  const redeemed = results[`${name}Redeemed`]
  const swapped = results[`${name}Swapped`]
  if (data === undefined || redeemed === undefined || swapped === undefined) {
    return undefined
  }
  const queued = word(data, 0)
  const tickets = word(data, 2)
  return {
    entered: Number((tickets + queued) / TICKET_UNIT),
    processed: Number((tickets - uint(redeemed) - uint(swapped)) / TICKET_UNIT),
  }
}
