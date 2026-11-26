import type { MulticallV3Response } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getMarketQuote } from './marketQuotes'

const TOKEN = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const POOL = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)
const WRAPPED_WETH = ChainSpecificAddress(
  'eth:0x3333333333333333333333333333333333333333',
)
const WRAPPED = ChainSpecificAddress.address(WRAPPED_WETH)
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const ROUTER = new utils.Interface([
  'function querySwapExactIn((address tokenIn, (address pool, address tokenOut, bool isBuffer)[] steps, uint256 exactAmountIn, uint256 minAmountOut)[] paths, address sender, bytes userData)',
])
const OUT = 10n ** 20n
const FAILED: MulticallV3Response = { success: false, data: Bytes.EMPTY }
const BALANCER_V3 = {
  type: 'balancerV3' as const,
  pool: POOL,
  wrappedWeth: WRAPPED_WETH,
}

describe(getMarketQuote.name, () => {
  it('takes the first word, as the quoter returns more after it', () => {
    const { decode } = getMarketQuote(TOKEN, { type: 'uniswapV3', fee: 100 })
    const data = utils.defaultAbiCoder.encode(
      ['uint256', 'uint160', 'uint32', 'uint256'],
      [OUT, 1, 2, 3],
    )

    expect(decode([{ success: true, data: Bytes.fromHex(data) }])).toEqual(OUT)
  })

  it('asks PancakeSwap its own quoter', () => {
    const uniswap = getMarketQuote(TOKEN, { type: 'uniswapV3', fee: 500 })
    const pancake = getMarketQuote(TOKEN, { type: 'pancakeV3', fee: 500 })

    expect(pancake.calls[0]?.to).not.toEqual(uniswap.calls[0]?.to)
    expect(pancake.calls[0]?.input).toEqual(uniswap.calls[0]?.input)
  })

  it('gives nothing for a pool that does not exist yet or reverts', () => {
    const { decode } = getMarketQuote(TOKEN, {
      type: 'curve',
      pool: POOL,
      i: 1,
      j: 0,
    })

    expect(decode([{ success: true, data: Bytes.EMPTY }])).toEqual(undefined)
    expect(decode([{ success: false, data: Bytes.EMPTY }])).toEqual(undefined)
  })

  it('reads the Balancer V3 path amount, behind the array offsets', () => {
    const { calls, decode } = getMarketQuote(TOKEN, BALANCER_V3)

    expect(decode([swapOut(OUT), words(OUT, 0n), words(0n)])).toEqual(OUT)
    // Sells into the pool, then unwraps to WETH through the vault's buffer.
    const [paths] = ROUTER.decodeFunctionData(
      'querySwapExactIn',
      calls[0]?.input.toString() ?? '',
    )
    expect(
      paths[0].steps.map((s: utils.Result) => [s.pool, s.tokenOut, s.isBuffer]),
    ).toEqual([
      [ChainSpecificAddress.address(POOL), WRAPPED, false],
      [WRAPPED, WETH, true],
    ])
  })

  it('gives no Balancer V3 quote while the wrapped WETH cannot be unwrapped', () => {
    const { decode } = getMarketQuote(TOKEN, BALANCER_V3)
    const buffer = words(OUT - 1n, 4n * OUT)

    // The buffer is short, so the swap would redeem the sale and half of
    // the buffer's wrapped WETH from the wrapper.
    expect(decode([swapOut(OUT), buffer, words(3n * OUT)])).toEqual(OUT)
    expect(decode([swapOut(OUT), buffer, words(3n * OUT - 1n)])).toEqual(
      undefined,
    )
    expect(decode([swapOut(OUT), buffer, FAILED])).toEqual(undefined)
  })

  it('reads the Fluid swap result from its revert', () => {
    const { decode } = getMarketQuote(TOKEN, {
      type: 'fluid',
      pool: POOL,
      swap0to1: true,
    })
    const revert = Bytes.fromHex(
      `0xb3bfda99${utils.defaultAbiCoder.encode(['uint256'], [OUT]).slice(2)}`,
    )

    expect(decode([{ success: false, data: revert }])).toEqual(OUT)
    expect(decode([FAILED])).toEqual(undefined)
  })

  describe('via another token', () => {
    const VIA = ChainSpecificAddress(
      'eth:0x4444444444444444444444444444444444444444',
    )
    const QUOTER = new utils.Interface([
      'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params)',
    ])
    const via = getMarketQuote(TOKEN, {
      type: 'via',
      token: VIA,
      first: { type: 'curve', pool: POOL, i: 0, j: 1 },
      then: [
        { type: 'uniswapV3', fee: 100 },
        { type: 'uniswapV3', fee: 500 },
      ],
    })
    const ONE = 10n ** 18n

    it('sells the other token in the second step', () => {
      expect(via.calls.length).toEqual(3)
      expect(via.calls[0]?.to).toEqual(ChainSpecificAddress.address(POOL))
      const [params] = QUOTER.decodeFunctionData(
        'quoteExactInputSingle',
        via.calls[1]?.input.toString() ?? '',
      )
      expect(params.tokenIn).toEqual(ChainSpecificAddress.address(VIA))
    })

    it('scales the best second step to what the first paid', () => {
      const paid = (ONE * 96n) / 100n
      const result = via.decode([
        words(paid),
        words((ONE * 110n) / 100n, 1n, 2n, 3n),
        words((ONE * 112n) / 100n, 1n, 2n, 3n),
      ])

      expect(result).toEqual((paid * 112n) / 100n)
    })

    it('gives nothing when either step cannot be quoted', () => {
      const quoted = words(ONE, 1n, 2n, 3n)

      expect(via.decode([FAILED, quoted, quoted])).toEqual(undefined)
      expect(via.decode([words(ONE), FAILED, FAILED])).toEqual(undefined)
    })
  })
})

function swapOut(amount: bigint): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(
      utils.defaultAbiCoder.encode(
        ['uint256[]', 'address[]', 'uint256[]'],
        [[amount], [WETH], [amount]],
      ),
    ),
  }
}

function words(...values: bigint[]): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(
      utils.defaultAbiCoder.encode(
        values.map(() => 'uint256'),
        values,
      ),
    ),
  }
}
