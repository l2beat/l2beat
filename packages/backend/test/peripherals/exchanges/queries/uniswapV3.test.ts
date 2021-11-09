import { expect } from 'chai'

import { Bytes, EthereumAddress } from '../../../../src/model'
import { encodeBalanceOf } from '../../../../src/peripherals/exchanges/queries/balanceOf'
import {
  DAI,
  WETH,
} from '../../../../src/peripherals/exchanges/queries/constants'
import {
  decodeUniswapV3Results,
  encodeSlotZero,
  encodeUniswapV3Requests,
  getUniswapV3PoolAddress,
} from '../../../../src/peripherals/exchanges/queries/uniswapV3'
import { encodeUniswapV3Results } from './utils'

const pool = getUniswapV3PoolAddress(DAI, WETH, 3000)

describe('getUniswapV3PoolAddress', () => {
  it('returns WETH-DAI pair address', () => {
    const poolDW = getUniswapV3PoolAddress(DAI, WETH, 3000)
    const poolWD = getUniswapV3PoolAddress(WETH, DAI, 3000)

    const expected = new EthereumAddress(
      '0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8'
    )

    expect(poolDW).to.deep.equal(expected)
    expect(poolWD).to.deep.equal(expected)
  })
})

describe('encodeUniswapV3Requests', () => {
  it('encodes a call to get the reserves', () => {
    const result = encodeUniswapV3Requests(DAI, 'uniswap-V3-weth-3000')
    expect(result).to.deep.equal([
      { address: DAI, data: encodeBalanceOf(pool) },
      { address: pool, data: encodeSlotZero() },
    ])
  })

  it('is order agnostic for the pool', () => {
    const result = encodeUniswapV3Requests(WETH, 'uniswap-V3-dai-3000')
    expect(result).to.deep.equal([
      { address: WETH, data: encodeBalanceOf(pool) },
      { address: pool, data: encodeSlotZero() },
    ])
  })
})

describe('decodeUniswapV3Results', () => {
  it('decodes empty array', () => {
    const result = decodeUniswapV3Results(DAI, 'uniswap-V3-weth-3000', [])
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes unsuccessful result', () => {
    const result = decodeUniswapV3Results(DAI, 'uniswap-V3-weth-3000', [
      { success: false, data: Bytes.EMPTY },
      { success: false, data: Bytes.EMPTY },
    ])
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes successful result for DAI', () => {
    const encoded = encodeUniswapV3Results(1234n, 1143348599330585316414292419n)
    const result = decodeUniswapV3Results(DAI, 'uniswap-V3-weth-3000', encoded)
    expect(result).to.deep.equal({
      liquidity: 1234n,
      price: 208256305967085n,
    })
  })

  it('decodes successful result for WETH', () => {
    const encoded = encodeUniswapV3Results(5678n, 1143348599330585316414292419n)
    const result = decodeUniswapV3Results(WETH, 'uniswap-V3-dai-3000', encoded)
    expect(result).to.deep.equal({
      liquidity: 5678n,
      price: 4801_775366927186522757n,
    })
  })
})
