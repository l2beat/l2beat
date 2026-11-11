import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { CallParameters } from '@l2beat/shared'
import { utils } from 'ethers'
import { encodeCall, UNIT, uint, word } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, type ProtocolReads, protocolReads } from './types'

const abi = new utils.Interface([
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function getExitQueueData() view returns (uint256 queuedShares, uint256 exitedAssets, uint256 totalTickets)',
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
 * The rate, and the counters of osETH's exit queue: tickets entered and
 * tickets processed. A queue's processed tickets are its third value, and
 * the entered ones add the shares still queued.
 */
export function getStakeWiseReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'stakewise' }>,
  blockNumber: number,
): ProtocolReads {
  const rate = encodeCall(abi, contracts.vaultController, 'convertToAssets', [
    UNIT,
  ])
  const token = { token: contracts.osETH, saleValue: saleAtRate }

  if (blockNumber < REDEEMERS.first) {
    return protocolReads({
      ...token,
      calls: { rate },
      toState: (r) => ({ ...EMPTY_EXIT, exchangeRate: uint(r.rate) }),
    })
  }

  // The retired queue can still process the shares left in it, so both count.
  const queues =
    blockNumber < REDEEMERS.second
      ? [contracts.previousRedeemer]
      : [contracts.previousRedeemer, contracts.redeemer]
  const calls: Record<string, CallParameters> = { rate }
  queues.forEach((queue, i) => {
    calls[`queue${i}`] = encodeCall(abi, queue, 'getExitQueueData')
  })
  return protocolReads<string>({
    ...token,
    calls,
    toState: (r) => {
      let entered = 0n
      let processed = 0n
      for (let i = 0; i < queues.length; i++) {
        const data = r[`queue${i}`]
        if (data === undefined) throw new Error('Missing exit queue read')
        const queued = word(data, 0)
        const total = word(data, 2)
        entered += total + queued
        processed += total
      }
      return {
        ...EMPTY_EXIT,
        exchangeRate: uint(r.rate),
        lastRequestId: Number(entered / TICKET_UNIT),
        lastFinalizedRequestId: Number(processed / TICKET_UNIT),
      }
    },
  })
}
