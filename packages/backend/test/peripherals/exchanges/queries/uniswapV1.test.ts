import { expect } from 'chai'

import { EthereumAddress } from '../../../../src/model'
import { MULTICALL_V1_ADDRESS } from '../../../../src/peripherals/ethereum/MulticallClient'
import {
  decodeUniswapV1Results,
  encodeBalanceOf,
  encodeGetEthBalance,
  encodeUniswapV1Requests,
} from '../../../../src/peripherals/exchanges/queries/uniswapV1'
import { encodeUniswapV1Results } from './utils'

describe('encodeUniswapV1Requests', () => {
  const TOKEN_A = new EthereumAddress('0x' + 'a'.repeat(40))
  const TOKEN_B = new EthereumAddress('0x' + 'b'.repeat(40))
  const EXCHANGE = new EthereumAddress('0x' + 'c'.repeat(40))

  it('encodes empty array when exchange is missing', () => {
    const result = encodeUniswapV1Requests(
      TOKEN_A,
      new Map([[TOKEN_B, EXCHANGE]])
    )
    expect(result).to.deep.equal([])
  })

  it('encodes two balance calls', () => {
    const result = encodeUniswapV1Requests(
      TOKEN_A,
      new Map([[TOKEN_A, EXCHANGE]])
    )
    expect(result).to.deep.equal([
      { address: MULTICALL_V1_ADDRESS, data: encodeGetEthBalance(EXCHANGE) },
      { address: TOKEN_A, data: encodeBalanceOf(EXCHANGE) },
    ])
  })
})

describe('decodeUniswapV1Results', () => {
  it('decodes empty array', () => {
    const result = decodeUniswapV1Results([])
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes unsuccessful first result', () => {
    const encoded = encodeUniswapV1Results(undefined, 1000n)
    const result = decodeUniswapV1Results(encoded)
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes unsuccessful second result', () => {
    const encoded = encodeUniswapV1Results(1000n, undefined)
    const result = decodeUniswapV1Results(encoded)
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes zero liquidity', () => {
    const encoded = encodeUniswapV1Results(1000n, 0n)
    const result = decodeUniswapV1Results(encoded)
    expect(result).to.deep.equal({ liquidity: 0n, price: 0n })
  })

  it('decodes successful result', () => {
    const encoded = encodeUniswapV1Results(1000n, 2000n)
    const result = decodeUniswapV1Results(encoded)
    expect(result).to.deep.equal({ liquidity: 2000n, price: 10n ** 18n / 2n })
  })
})
