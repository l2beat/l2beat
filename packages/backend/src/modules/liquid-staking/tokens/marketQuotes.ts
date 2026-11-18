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
  'function getBufferBalance(address wrappedToken) view returns (uint256 underlyingBalanceRaw, uint256 wrappedBalanceRaw)',
  'function maxRedeem(address owner) view returns (uint256)',
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
const BALANCER_V3_VAULT = ChainSpecificAddress(
  'eth:0xbA1333333333a1BA1108E8412f11850A5C319bA9',
)
const ZERO = EthereumAddress.ZERO
const DEAD = EthereumAddress('0x000000000000000000000000000000000000dEaD')
/** Fluid pools revert with the swap result, `FluidDexSwapResult(uint256)`. */
const FLUID_SWAP_RESULT = '0xb3bfda99'

export interface MarketQuote {
  /** The quote, then any reads that tell whether it could be carried out. */
  calls: CallParameters[]
  /**
   * The ETH out, or nothing for a pool that doesn't exist yet or can't fill
   * the sale. A drained pool still quotes, low, and loses to the others.
   * `responses` are those of `calls`, in order.
   */
  decode: (responses: MulticallV3Response[]) => bigint | undefined
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
      return single(
        encodeCall(abi, quote.pool, `get_dy(${index},${index},uint256)`, [
          quote.i,
          quote.j,
          MARKET_SALE,
        ]),
        amountOut,
      )
    }
    case 'uniswapV3':
    case 'pancakeV3': {
      const quoter =
        quote.type === 'uniswapV3' ? UNISWAP_V3_QUOTER : PANCAKE_V3_QUOTER
      return single(
        encodeCall(abi, quoter, 'quoteExactInputSingle', [
          [token, WETH, MARKET_SALE, quote.fee, 0],
        ]),
        amountOut,
      )
    }
    case 'balancerV2':
      return single(
        encodeCall(abi, BALANCER_QUERIES, 'querySwap', [
          [quote.poolId, 0, token, WETH, MARKET_SALE, '0x'],
          [ZERO, false, ZERO, false],
        ]),
        amountOut,
      )
    case 'balancerV3': {
      const wrappedWeth = ChainSpecificAddress.address(quote.wrappedWeth)
      const steps = [
        [ChainSpecificAddress.address(quote.pool), wrappedWeth, false],
        // The vault's buffer unwraps it to WETH.
        [wrappedWeth, WETH, true],
      ]
      return {
        calls: [
          // The router answers only an eth_call sent without a sender, which
          // is how the multicall is made.
          encodeCall(abi, BALANCER_V3_BATCH_ROUTER, 'querySwapExactIn', [
            [[token, steps, MARKET_SALE, 0]],
            ZERO,
            '0x',
          ]),
          encodeCall(abi, BALANCER_V3_VAULT, 'getBufferBalance', [wrappedWeth]),
          encodeCall(abi, quote.wrappedWeth, 'maxRedeem', [
            ChainSpecificAddress.address(BALANCER_V3_VAULT),
          ]),
        ],
        decode: ([swap, buffer, redeemable]) => {
          const data = swap && returnData(swap)
          const bufferData = buffer && returnData(buffer)
          const redeemableData = redeemable && returnData(redeemable)
          if (!data || data.length < 5 * 32) return undefined
          if (!bufferData || !redeemableData) return undefined
          // The path's amount out: three array offsets, a length, then it.
          const out = word(data, 4)
          // A query prices the unwrap without checking that the WETH can be
          // paid. A swap pays it from the vault's buffer if that covers it.
          // Otherwise it redeems the wrapped WETH sold, and up to half the
          // buffer's, which fails while the wrapper has no WETH to withdraw.
          // A wrapped WETH is worth more than one WETH, so the amount out
          // bounds the amount sold.
          const [bufferWeth, bufferWrapped] = [
            word(bufferData, 0),
            word(bufferData, 1),
          ]
          const payable =
            bufferWeth >= out ||
            uint(redeemableData) >= out + bufferWrapped / 2n
          return payable ? out : undefined
        },
      }
    }
    case 'fluid':
      return single(
        encodeCall(abi, quote.pool, 'swapIn', [
          quote.swap0to1,
          MARKET_SALE,
          0,
          DEAD,
        ]),
        (response) => {
          const revert = response.data.toString()
          if (response.success || !revert.startsWith(FLUID_SWAP_RESULT)) return
          return uint(
            Bytes.fromHex(`0x${revert.slice(FLUID_SWAP_RESULT.length)}`),
          )
        },
      )
  }
}

function single(
  call: CallParameters,
  decode: (response: MulticallV3Response) => bigint | undefined,
): MarketQuote {
  return {
    calls: [call],
    decode: ([response]) => (response ? decode(response) : undefined),
  }
}

/** The amount out is the first word of most quotes. */
function amountOut(response: MulticallV3Response): bigint | undefined {
  const data = returnData(response)
  return data && uint(data)
}
