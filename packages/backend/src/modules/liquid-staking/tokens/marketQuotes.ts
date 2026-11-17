import type { ProjectLiquidStakingMarketQuote } from '@l2beat/config'
import type { CallParameters, MulticallV3Response } from '@l2beat/shared'
import {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { encodeCall, returnData, UNIT, uint, word } from './calls'

/** The market quotes sell one token. */
export const MARKET_SALE = UNIT

export function saleAtRate(exchangeRate: bigint): bigint {
  return (MARKET_SALE * exchangeRate) / UNIT
}

const abi = new utils.Interface([
  'function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)',
  'function get_dy(uint256 i, uint256 j, uint256 dx) view returns (uint256)',
  'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
  'function querySwap((bytes32 poolId, uint8 kind, address assetIn, address assetOut, uint256 amount, bytes userData) singleSwap, (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance) funds) returns (uint256)',
  'function swapIn(bool swap0to1, uint256 amountIn, uint256 amountOutMin, address to) payable returns (uint256)',
  'function querySwapExactIn((address tokenIn, (address pool, address tokenOut, bool isBuffer)[] steps, uint256 exactAmountIn, uint256 minAmountOut)[] paths, address sender, bytes userData) returns (uint256[] pathAmountsOut, address[] tokensOut, uint256[] amountsOut)',
])

const WETH = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const UNISWAP_V3_QUOTER = ChainSpecificAddress(
  'eth:0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
)
const PANCAKE_V3_QUOTER = ChainSpecificAddress(
  'eth:0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
)
const BALANCER_QUERIES = ChainSpecificAddress(
  'eth:0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
)
const BALANCER_V3_BATCH_ROUTER = ChainSpecificAddress(
  'eth:0x136f1EFcC3f8f88516B9E94110D56FDBfB1778d1',
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
    case 'curveCrypto': {
      const index = quote.type === 'curve' ? 'int128' : 'uint256'
      return {
        call: encodeCall(abi, quote.pool, `get_dy(${index},${index},uint256)`, [
          quote.i,
          quote.j,
          MARKET_SALE,
        ]),
        decode: amountOut,
      }
    }
    case 'uniswapV3':
    case 'pancakeV3': {
      const quoter =
        quote.type === 'uniswapV3' ? UNISWAP_V3_QUOTER : PANCAKE_V3_QUOTER
      return {
        call: encodeCall(abi, quoter, 'quoteExactInputSingle', [
          [token, WETH, MARKET_SALE, quote.fee, 0],
        ]),
        decode: amountOut,
      }
    }
    case 'balancerV2':
      return {
        call: encodeCall(abi, BALANCER_QUERIES, 'querySwap', [
          [quote.poolId, 0, token, WETH, MARKET_SALE, '0x'],
          [ZERO, false, ZERO, false],
        ]),
        decode: amountOut,
      }
    case 'balancerV3': {
      const wrappedWeth = ChainSpecificAddress.address(quote.wrappedWeth)
      const steps = [
        [ChainSpecificAddress.address(quote.pool), wrappedWeth, false],
        // The vault's buffer unwraps it to WETH.
        [wrappedWeth, WETH, true],
      ]
      return {
        // The router answers only an eth_call sent without a sender, which
        // is how the multicall is made.
        call: encodeCall(abi, BALANCER_V3_BATCH_ROUTER, 'querySwapExactIn', [
          [[token, steps, MARKET_SALE, 0]],
          ZERO,
          '0x',
        ]),
        decode: (response) => {
          const data = returnData(response)
          // The path's amount out: three array offsets, a length, then it.
          return data && data.length >= 5 * 32 ? word(data, 4) : undefined
        },
      }
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

/** The amount out is the first word of most quotes. */
function amountOut(response: MulticallV3Response): bigint | undefined {
  const data = returnData(response)
  return data && uint(data)
}
