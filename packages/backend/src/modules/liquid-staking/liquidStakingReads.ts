import type {
  ProjectLiquidStakingContracts,
  ProjectLiquidStakingMarketQuote,
} from '@l2beat/config'
import type { LiquidStakingSnapshotRecord } from '@l2beat/database'
import type { CallParameters, MulticallV3Response } from '@l2beat/shared'
import {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

export type LiquidStakingState = Pick<
  LiquidStakingSnapshotRecord,
  | 'exchangeRate'
  | 'lastRequestId'
  | 'lastFinalizedRequestId'
  | 'instantExitEth'
  | 'instantExitFeeBps'
  | 'lockTime'
  | 'marketExitEth'
  | 'marketExitValueEth'
>

/** What a protocol's own contracts give, before the market quotes. */
type ProtocolState = Omit<
  LiquidStakingState,
  'marketExitEth' | 'marketExitValueEth'
>

export interface LiquidStakingRead {
  call: CallParameters
  /**
   * A market quote: a pool that doesn't exist yet, or can't fill the sale,
   * gives no quote instead of failing the hour.
   */
  optional?: boolean
}

export interface LiquidStakingReads {
  reads: LiquidStakingRead[]
  /**
   * Maps the responses, in read order, onto a snapshot. Required reads have
   * succeeded with data.
   */
  toState: (
    responses: MulticallV3Response[],
    timestamp: UnixTime,
  ) => LiquidStakingState
}

/** The market quotes sell this many tokens. */
export const MARKET_SALE = 100n * 10n ** 18n

const UNIT = 10n ** 18n

const abi = new utils.Interface([
  'function getPooledEthByShares(uint256 sharesAmount) view returns (uint256)',
  'function getLastRequestId() view returns (uint256)',
  'function getLastFinalizedRequestId() view returns (uint256)',
  'function getExchangeRate() view returns (uint256)',
  'function getTotalCollateral() view returns (uint256)',
  'function getRate() view returns (uint256)',
  'function nextRequestId() view returns (uint32)',
  'function lastFinalizedRequestId() view returns (uint32)',
  'function exchangeRate() view returns (uint256)',
  'function lockTime() view returns (uint256)',
  'function nextIndex() view returns (uint256)',
  'function startAllocatedEthIndex() view returns (uint256)',
  'function paused() view returns (bool)',
  'function pausedUntil() view returns (uint256)',
  'function totalRedeemableAmount() view returns (uint256)',
  'function exitFeeInBps() view returns (uint16)',
  'function totalRedeemableAmount(address token) view returns (uint256)',
  'function getInstantLiquidityAmount(address token) view returns (uint256)',
  'function lowWatermarkInETH(address token) view returns (uint256)',
  'function tokenToRedemptionInfo(address token) view returns ((uint64,uint64,uint64,uint64) limit, uint16 exitFeeSplitToTreasuryInBps, uint16 exitFeeInBps, uint16 lowWatermarkInBpsOfTvl)',
  'function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)',
  'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
  'function querySwap((bytes32 poolId, uint8 kind, address assetIn, address assetOut, uint256 amount, bytes userData) singleSwap, (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance) funds) returns (uint256)',
  'function swapIn(bool swap0to1, uint256 amountIn, uint256 amountOutMin, address to) payable returns (uint256)',
])

const WETH = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const UNISWAP_V3_QUOTER = EthereumAddress(
  '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
)
const BALANCER_QUERIES = EthereumAddress(
  '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
)
const ZERO = EthereumAddress.ZERO
const DEAD = EthereumAddress('0x000000000000000000000000000000000000dEaD')
/** Fluid pools revert with the swap result, `FluidDexSwapResult(uint256)`. */
const FLUID_SWAP_RESULT = '0xb3bfda99'

/**
 * ether.fi's redemption manager went live at the first block, took the output
 * token as an argument from the second, and gained a timed pause at the third.
 */
const ETHERFI_REDEMPTION = {
  deployed: 22_090_400,
  tokenArgument: 23_693_485,
  pausedUntil: 25_533_308,
}
const ETH_TOKEN = EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')

const EMPTY_EXIT = {
  lastRequestId: null,
  lastFinalizedRequestId: null,
  instantExitEth: null,
  instantExitFeeBps: null,
  lockTime: null,
}

/** Every getter exists on each implementation live at `blockNumber`. */
export function getLiquidStakingReads(
  contracts: ProjectLiquidStakingContracts,
  blockNumber: number,
): LiquidStakingReads {
  switch (contracts.type) {
    case 'lido':
      return withMarketQuotes(contracts.stETH, contracts.marketQuotes, {
        reads: [
          // ETH per share, which is ETH per wstETH: stETH itself stays at
          // one ETH and rebases.
          read(contracts.stETH, 'getPooledEthByShares', [UNIT]),
          read(contracts.withdrawalQueue, 'getLastRequestId'),
          read(contracts.withdrawalQueue, 'getLastFinalizedRequestId'),
        ],
        // The quotes sell stETH, worth one ETH each.
        saleValue: () => MARKET_SALE,
        toState: ([rate, lastRequest, lastFinalized]) => ({
          ...EMPTY_EXIT,
          exchangeRate: uint(rate),
          lastRequestId: Number(uint(lastRequest)),
          lastFinalizedRequestId: Number(uint(lastFinalized)),
        }),
      })
    case 'rocketpool':
      return withMarketQuotes(contracts.rETH, contracts.marketQuotes, {
        reads: [
          read(contracts.rETH, 'getExchangeRate'),
          read(contracts.rETH, 'getTotalCollateral'),
        ],
        toState: ([rate, collateral]) => ({
          ...EMPTY_EXIT,
          exchangeRate: uint(rate),
          instantExitEth: uint(collateral),
          instantExitFeeBps: 0,
        }),
      })
    case 'etherfi': {
      const redemption = getEtherFiRedemptionReads(
        contracts.redemptionManager,
        blockNumber,
      )
      return withMarketQuotes(contracts.weETH, contracts.marketQuotes, {
        reads: [
          read(contracts.weETH, 'getRate'),
          read(contracts.withdrawRequestNft, 'nextRequestId'),
          read(contracts.withdrawRequestNft, 'lastFinalizedRequestId'),
          ...redemption.reads,
        ],
        toState: ([rate, nextRequest, lastFinalized, ...rest], timestamp) => ({
          ...EMPTY_EXIT,
          exchangeRate: uint(rate),
          // nextRequestId points one past the newest request.
          lastRequestId: Number(uint(nextRequest)) - 1,
          lastFinalizedRequestId: Number(uint(lastFinalized)),
          ...redemption.toState(rest, timestamp),
        }),
      })
    }
    case 'wbeth':
      return withMarketQuotes(contracts.wBETH, contracts.marketQuotes, {
        reads: [
          read(contracts.wBETH, 'exchangeRate'),
          read(contracts.unwrapToken, 'lockTime'),
          read(contracts.unwrapToken, 'nextIndex'),
          read(contracts.unwrapToken, 'startAllocatedEthIndex'),
        ],
        toState: ([rate, lockTime, nextIndex, startAllocated]) => ({
          ...EMPTY_EXIT,
          exchangeRate: uint(rate),
          lockTime: Number(uint(lockTime)),
          // A request can be claimed once it's allocated ETH and its lock has
          // passed. Allocation goes in request order, like a queue.
          lastRequestId: Number(uint(nextIndex)) - 1,
          lastFinalizedRequestId: Number(uint(startAllocated)) - 1,
        }),
      })
  }
}

type ExitState = Pick<
  LiquidStakingState,
  'instantExitEth' | 'instantExitFeeBps'
>

/**
 * What a weETH holder can redeem at once, and the fee. Nothing is redeemable
 * while paused, and the views don't say so themselves.
 */
function getEtherFiRedemptionReads(
  manager: ChainSpecificAddress,
  blockNumber: number,
): {
  reads: LiquidStakingRead[]
  toState: (responses: MulticallV3Response[], timestamp: UnixTime) => ExitState
} {
  if (blockNumber < ETHERFI_REDEMPTION.deployed) {
    return {
      reads: [],
      toState: () => ({ instantExitEth: null, instantExitFeeBps: null }),
    }
  }
  if (blockNumber < ETHERFI_REDEMPTION.tokenArgument) {
    return {
      reads: [
        read(manager, 'totalRedeemableAmount()'),
        read(manager, 'exitFeeInBps'),
        read(manager, 'paused'),
      ],
      toState: ([redeemable, fee, paused]) => ({
        instantExitEth: uint(paused) === 1n ? 0n : uint(redeemable),
        instantExitFeeBps: Number(uint(fee)),
      }),
    }
  }
  const timedPause = blockNumber >= ETHERFI_REDEMPTION.pausedUntil
  return {
    reads: [
      read(manager, 'totalRedeemableAmount(address)', [ETH_TOKEN]),
      read(manager, 'getInstantLiquidityAmount', [ETH_TOKEN]),
      read(manager, 'lowWatermarkInETH', [ETH_TOKEN]),
      read(manager, 'tokenToRedemptionInfo', [ETH_TOKEN]),
      read(manager, 'paused'),
      ...(timedPause ? [read(manager, 'pausedUntil')] : []),
    ],
    toState: (
      [redeemable, liquidity, watermark, info, paused, pausedUntil],
      timestamp,
    ) => {
      const isPaused =
        uint(paused) === 1n ||
        (pausedUntil !== undefined && uint(pausedUntil) >= BigInt(timestamp))
      // Until a 2026-02 upgrade, totalRedeemableAmount ignored the low
      // watermark, the ETH the pool keeps back; capping by it changes nothing
      // after.
      const aboveWatermark = uint(liquidity) - uint(watermark)
      const capacity = min(
        uint(redeemable),
        aboveWatermark > 0n ? aboveWatermark : 0n,
      )
      return {
        instantExitEth: isPaused ? 0n : capacity,
        // (limit, fee split to treasury, exit fee, watermark): the limit
        // takes four words.
        instantExitFeeBps: Number(word(info, 5)),
      }
    },
  }
}

/**
 * Adds a quote per pool to the reads, and keeps the best. `saleValue` is
 * what the sold tokens are worth at the protocol's rate.
 */
function withMarketQuotes(
  token: ChainSpecificAddress,
  quotes: ProjectLiquidStakingMarketQuote[],
  base: {
    reads: LiquidStakingRead[]
    saleValue?: (exchangeRate: bigint) => bigint
    toState: (
      responses: MulticallV3Response[],
      timestamp: UnixTime,
    ) => ProtocolState
  },
): LiquidStakingReads {
  const saleValue =
    base.saleValue ?? ((rate: bigint) => (MARKET_SALE * rate) / UNIT)
  return {
    reads: [
      ...base.reads,
      ...quotes.map((quote) => ({
        call: getQuoteCall(ChainSpecificAddress.address(token), quote),
        optional: true,
      })),
    ],
    toState: (responses, timestamp) => {
      const state = base.toState(
        responses.slice(0, base.reads.length),
        timestamp,
      )
      const best = responses
        .slice(base.reads.length)
        .map((response, i) => decodeQuote(quotes[i], response))
        .reduce<bigint | undefined>(
          (best, out) =>
            out !== undefined && (best === undefined || out > best)
              ? out
              : best,
          undefined,
        )
      return {
        ...state,
        marketExitEth: best ?? null,
        marketExitValueEth:
          best === undefined ? null : saleValue(state.exchangeRate),
      }
    },
  }
}

function getQuoteCall(
  token: EthereumAddress,
  quote: ProjectLiquidStakingMarketQuote,
): CallParameters {
  switch (quote.type) {
    case 'curve':
      return call(ChainSpecificAddress.address(quote.pool), 'get_dy', [
        quote.i,
        quote.j,
        MARKET_SALE,
      ])
    case 'uniswapV3':
      return call(UNISWAP_V3_QUOTER, 'quoteExactInputSingle', [
        [token, WETH, MARKET_SALE, quote.fee, 0],
      ])
    case 'balancerV2':
      return call(BALANCER_QUERIES, 'querySwap', [
        [quote.poolId, 0, token, WETH, MARKET_SALE, '0x'],
        [ZERO, false, ZERO, false],
      ])
    case 'fluid':
      return call(ChainSpecificAddress.address(quote.pool), 'swapIn', [
        quote.swap0to1,
        MARKET_SALE,
        0,
        DEAD,
      ])
  }
}

/**
 * The ETH out, or nothing for a pool that doesn't exist yet or can't fill
 * the sale. A drained pool still quotes, low, and loses to the others.
 */
function decodeQuote(
  quote: ProjectLiquidStakingMarketQuote | undefined,
  response: MulticallV3Response,
): bigint | undefined {
  if (quote?.type === 'fluid') {
    const revert = response.data.toString()
    if (response.success || !revert.startsWith(FLUID_SWAP_RESULT)) return
    return word(Bytes.fromHex(`0x${revert.slice(FLUID_SWAP_RESULT.length)}`), 0)
  }
  // The amount out is the first word of every other quote.
  if (!response.success || response.data.length < 32) return
  return word(response.data, 0)
}

function read(
  address: ChainSpecificAddress,
  functionName: string,
  args: unknown[] = [],
): LiquidStakingRead {
  return {
    call: call(ChainSpecificAddress.address(address), functionName, args),
  }
}

function call(
  to: EthereumAddress,
  functionName: string,
  args: unknown[] = [],
): CallParameters {
  return {
    to,
    input: Bytes.fromHex(abi.encodeFunctionData(functionName, args)),
  }
}

/** A required read's unsigned integer, whatever its width. */
function uint(response: MulticallV3Response | undefined): bigint {
  if (response === undefined) throw new Error('Missing liquid staking read')
  return word(response.data, 0)
}

function word(data: Bytes | MulticallV3Response, index: number): bigint {
  const bytes = data instanceof Bytes ? data : data.data
  return BigInt(bytes.slice(index * 32, (index + 1) * 32).toString())
}

function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}
