import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { type Bytes, EthereumAddress, type UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { encodeCall, uint, word } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, type ProtocolReads, protocolReads } from './types'

const abi = new utils.Interface([
  'function getRate() view returns (uint256)',
  'function nextRequestId() view returns (uint32)',
  'function lastFinalizedRequestId() view returns (uint32)',
])
/** The redemption manager before the output token became an argument. */
const firstManagerAbi = new utils.Interface([
  'function totalRedeemableAmount() view returns (uint256)',
  'function exitFeeInBps() view returns (uint16)',
  'function paused() view returns (bool)',
])
const managerAbi = new utils.Interface([
  'function totalRedeemableAmount(address token) view returns (uint256)',
  'function getInstantLiquidityAmount(address token) view returns (uint256)',
  'function lowWatermarkInETH(address token) view returns (uint256)',
  'function tokenToRedemptionInfo(address token) view returns ((uint64,uint64,uint64,uint64) limit, uint16 exitFeeSplitToTreasuryInBps, uint16 exitFeeInBps, uint16 lowWatermarkInBpsOfTvl)',
  'function paused() view returns (bool)',
  'function pausedUntil() view returns (uint256)',
])

/**
 * ether.fi's redemption manager went live at the first block, took the output
 * token as an argument from the second, and gained a timed pause at the third.
 */
const REDEMPTION_MANAGER = {
  deployed: 22_090_400,
  tokenArgument: 23_693_485,
  pausedUntil: 25_533_308,
}
const ETH_TOKEN = EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')

/**
 * The queue counters, and what a weETH holder can redeem at once, and the
 * fee. Nothing is redeemable while paused, and the views don't say so
 * themselves.
 */
export function getEtherFiReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'etherfi' }>,
  blockNumber: number,
): ProtocolReads {
  const queue = {
    rate: encodeCall(abi, contracts.weETH, 'getRate'),
    nextRequest: encodeCall(abi, contracts.withdrawRequestNft, 'nextRequestId'),
    lastFinalized: encodeCall(
      abi,
      contracts.withdrawRequestNft,
      'lastFinalizedRequestId',
    ),
  }
  const queueState = (r: Record<keyof typeof queue, Bytes>) => ({
    ...EMPTY_EXIT,
    exchangeRate: uint(r.rate),
    // nextRequestId points one past the newest request.
    lastRequestId: Number(uint(r.nextRequest)) - 1,
    lastFinalizedRequestId: Number(uint(r.lastFinalized)),
  })
  const token = { token: contracts.weETH, saleValue: saleAtRate }

  if (blockNumber < REDEMPTION_MANAGER.deployed) {
    return protocolReads({ ...token, calls: queue, toState: queueState })
  }

  const manager = contracts.redemptionManager
  if (blockNumber < REDEMPTION_MANAGER.tokenArgument) {
    return protocolReads({
      ...token,
      calls: {
        ...queue,
        redeemable: encodeCall(
          firstManagerAbi,
          manager,
          'totalRedeemableAmount',
        ),
        exitFee: encodeCall(firstManagerAbi, manager, 'exitFeeInBps'),
        paused: encodeCall(firstManagerAbi, manager, 'paused'),
      },
      toState: (r) => ({
        ...queueState(r),
        instantExitEth: uint(r.paused) === 1n ? 0n : uint(r.redeemable),
        instantExitFeeBps: Number(uint(r.exitFee)),
      }),
    })
  }

  const calls = {
    ...queue,
    redeemable: encodeCall(managerAbi, manager, 'totalRedeemableAmount', [
      ETH_TOKEN,
    ]),
    liquidity: encodeCall(managerAbi, manager, 'getInstantLiquidityAmount', [
      ETH_TOKEN,
    ]),
    watermark: encodeCall(managerAbi, manager, 'lowWatermarkInETH', [
      ETH_TOKEN,
    ]),
    info: encodeCall(managerAbi, manager, 'tokenToRedemptionInfo', [ETH_TOKEN]),
    paused: encodeCall(managerAbi, manager, 'paused'),
  }
  const state = (r: Record<keyof typeof calls, Bytes>, timedPause: boolean) => {
    // Until a 2026-02 upgrade, totalRedeemableAmount ignored the low
    // watermark, the ETH the pool keeps back; capping by it changes nothing
    // after.
    const aboveWatermark = uint(r.liquidity) - uint(r.watermark)
    const capacity = min(
      uint(r.redeemable),
      aboveWatermark > 0n ? aboveWatermark : 0n,
    )
    return {
      ...queueState(r),
      instantExitEth: uint(r.paused) === 1n || timedPause ? 0n : capacity,
      // (limit, fee split to treasury, exit fee, watermark): the limit takes
      // four words.
      instantExitFeeBps: Number(word(r.info, 5)),
    }
  }

  if (blockNumber < REDEMPTION_MANAGER.pausedUntil) {
    return protocolReads({ ...token, calls, toState: (r) => state(r, false) })
  }
  return protocolReads({
    ...token,
    calls: {
      ...calls,
      pausedUntil: encodeCall(managerAbi, manager, 'pausedUntil'),
    },
    toState: (r, timestamp: UnixTime) =>
      state(r, uint(r.pausedUntil) >= BigInt(timestamp)),
  })
}

function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}
