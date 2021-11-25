import { expect } from 'chai'

import { Bytes, EthereumAddress, Exchange } from '../../../../src/model'
import {
  DAI,
  WETH,
} from '../../../../src/peripherals/exchanges/queries/constants'
import {
  decodeUniswapV2Results,
  encodeGetReserves,
  encodeUniswapV2Requests,
  getUniswapV2PairAddress,
} from '../../../../src/peripherals/exchanges/queries/uniswapV2'
import { encodeUniswapV2Results } from './utils'

const pair = getUniswapV2PairAddress(DAI, WETH)

describe('getUniswapV2PairAddress', () => {
  it('returns WETH-DAI pair address', () => {
    const pairDW = getUniswapV2PairAddress(DAI, WETH)
    const pairWD = getUniswapV2PairAddress(WETH, DAI)

    const expected = EthereumAddress(
      '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11'
    )

    expect(pairDW).to.deep.equal(expected)
    expect(pairWD).to.deep.equal(expected)
  })
})

describe('encodeUniswapV2Requests', () => {
  it('encodes a call to get the reserves', () => {
    const result = encodeUniswapV2Requests(DAI, Exchange.uniswapV2('weth'))
    expect(result).to.deep.equal([{ address: pair, data: encodeGetReserves() }])
  })

  it('is order agnostic', () => {
    const result = encodeUniswapV2Requests(WETH, Exchange.uniswapV2('dai'))
    expect(result).to.deep.equal([{ address: pair, data: encodeGetReserves() }])
  })
})

describe('decodeUniswapV2Results', () => {
  it('decodes empty array', () => {
    const result = decodeUniswapV2Results(DAI, Exchange.uniswapV2('weth'), [])
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes unsuccessful result', () => {
    const result = decodeUniswapV2Results(DAI, Exchange.uniswapV2('weth'), [
      { success: false, data: Bytes.EMPTY },
    ])
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes successful result for DAI', () => {
    const encoded = encodeUniswapV2Results(4_000_000n, 1_000n)
    const result = decodeUniswapV2Results(
      DAI,
      Exchange.uniswapV2('weth'),
      encoded
    )
    expect(result).to.deep.equal({
      liquidity: 4_000_000n,
      price: 10n ** 18n / 4_000n,
    })
  })

  it('decodes successful result for WETH', () => {
    const encoded = encodeUniswapV2Results(4_000_000n, 1_000n)
    const result = decodeUniswapV2Results(
      WETH,
      Exchange.uniswapV2('dai'),
      encoded
    )
    expect(result).to.deep.equal({
      liquidity: 1_000n,
      price: 10n ** 18n * 4_000n,
    })
  })

  it('decodes authentic result for WETH-USDT', () => {
    const encoded = encodeUniswapV2Results(
      24_813_092_743_672_255_251_334n,
      108_420_450_239_474n
    )
    const result = decodeUniswapV2Results(
      WETH,
      Exchange.uniswapV2('usdt'),
      encoded
    )
    expect(result).to.deep.equal({
      liquidity: 24_813_092_743_672_255_251_334n,
      price: 4_369_485_551n,
    })
  })
})
