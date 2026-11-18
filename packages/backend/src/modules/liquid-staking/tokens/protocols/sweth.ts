import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { utils } from 'ethers'
import { encodeCall, uint } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, type ProtocolReads, protocolReads } from './types'

const abi = new utils.Interface([
  'function swETHToETHRate() view returns (uint256)',
  'function getLastTokenIdCreated() view returns (uint256)',
  'function getLastTokenIdProcessed() view returns (uint256)',
])

/** The block that deployed swEXIT. Before it swETH had no exit queue. */
const EXIT_QUEUE_BLOCK = 19_324_498

/**
 * The rate, and the counters of swEXIT, whose requests are NFTs numbered in
 * order and processed in order, inside the rate reports.
 */
export function getSwethReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'sweth' }>,
  blockNumber: number,
): ProtocolReads {
  const rate = encodeCall(abi, contracts.swETH, 'swETHToETHRate')
  const token = { token: contracts.swETH, saleValue: saleAtRate }

  if (blockNumber < EXIT_QUEUE_BLOCK) {
    return protocolReads({
      ...token,
      calls: { rate },
      toState: (r) => ({ ...EMPTY_EXIT, exchangeRate: uint(r.rate) }),
    })
  }

  return protocolReads({
    ...token,
    calls: {
      rate,
      created: encodeCall(abi, contracts.exitQueue, 'getLastTokenIdCreated'),
      processed: encodeCall(
        abi,
        contracts.exitQueue,
        'getLastTokenIdProcessed',
      ),
    },
    toState: (r) => ({
      ...EMPTY_EXIT,
      exchangeRate: uint(r.rate),
      lastRequestId: Number(uint(r.created)),
      lastFinalizedRequestId: Number(uint(r.processed)),
    }),
  })
}
