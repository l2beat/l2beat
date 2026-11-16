import type { ProjectLiquidStakingMarketQuote } from '@l2beat/config'
import type { CallParameters, MulticallV3Response } from '@l2beat/shared'
import {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { encodeCall, returnData, UNIT, uint } from './calls'

/** The market quotes sell this many tokens. */
export const MARKET_SALE = 100n * UNIT

export function saleAtRate(exchangeRate: bigint): bigint {
  return (MARKET_SALE * exchangeRate) / UNIT
}

const abi = new utils.Interface([
  'function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)',
  'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
  'function querySwap((bytes32 poolId, uint8 kind, address assetIn, address assetOut, uint256 amount, bytes userData) singleSwap, (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance) funds) returns (uint256)',
  'function swapIn(bool swap0to1, uint256 amountIn, uint256 amountOutMin, address to) payable returns (uint256)',
])

const WETH = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const UNISWAP_V3_QUOTER = ChainSpecificAddress(
  'eth:0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
)
const BALANCER_QUERIES = ChainSpecificAddress(
  'eth:0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
)
const ZERO = EthereumAddress.ZERO
const DEAD = EthereumAddress('0x000000000000000000000000000000000000dEaD')
/** Fluid pools revert with the swap result, `FluidDexSwapResult(uint256)`. */
const FLUID_SWAP_RESULT = '0xb3bfda99'

export interface MarketQuote {
  call: CallParameters
  /**
   * The ETH out, or nothing for a pool that doesn't exist yet or can't fill
   * the sale. A drained pool still quotes, low, and loses to the others.
   */
  decode: (response: MulticallV3Response) => bigint | undefined
}

export function getMarketQuote(
  soldToken: ChainSpecificAddress,
  quote: ProjectLiquidStakingMarketQuote,
): MarketQuote {
  const token = ChainSpecificAddress.address(soldToken)
  switch (quote.type) {
    case 'curve':
      return {
        call: encodeCall(abi, quote.pool, 'get_dy', [
          quote.i,
          quote.j,
          MARKET_SALE,
        ]),
        decode: amountOut,
      }
    case 'uniswapV3':
      return {
        call: encodeCall(abi, UNISWAP_V3_QUOTER, 'quoteExactInputSingle', [
          [token, WETH, MARKET_SALE, quote.fee, 0],
        ]),
        decode: amountOut,
      }
    case 'balancerV2':
      return {
        call: encodeCall(abi, BALANCER_QUERIES, 'querySwap', [
          [quote.poolId, 0, token, WETH, MARKET_SALE, '0x'],
          [ZERO, false, ZERO, false],
        ]),
        decode: amountOut,
      }
    case 'fluid':
      return {
        call: encodeCall(abi, quote.pool, 'swapIn', [
          quote.swap0to1,
          MARKET_SALE,
          0,
          DEAD,
        ]),
        decode: (response) => {
          const revert = response.data.toString()
          if (response.success || !revert.startsWith(FLUID_SWAP_RESULT)) return
          return uint(
            Bytes.fromHex(`0x${revert.slice(FLUID_SWAP_RESULT.length)}`),
          )
        },
      }
  }
}

/** The amount out is the first word of every quote but Fluid's. */
function amountOut(response: MulticallV3Response): bigint | undefined {
  const data = returnData(response)
  return data && uint(data)
}
