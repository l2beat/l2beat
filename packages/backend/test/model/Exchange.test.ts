import { expect } from 'earljs'

import { Exchange } from '../../src/model'

describe('Exchange', () => {
  it('can represent a Uniswap V1 exchange', () => {
    const exchange = Exchange.uniswapV1()

    expect(exchange.name).toEqual('uniswap-v1')
    expect(exchange.family).toEqual('uniswap-v1')
    expect(exchange.quoteAssetId).toEqual('ether')
    expect(exchange.details).toEqual({})

    expect(Exchange.fromName(exchange.name)).toEqual(exchange)
  })

  it('can represent a Uniswap V2 exchange', () => {
    const exchange = Exchange.uniswapV2('dai')

    expect(exchange.name).toEqual('uniswap-v2-dai')
    expect(exchange.family).toEqual('uniswap-v2')
    expect(exchange.quoteAssetId).toEqual('dai-stablecoin')
    expect(exchange.details).toEqual({})

    expect(Exchange.fromName(exchange.name)).toEqual(exchange)
  })

  it('can represent a Uniswap V3 exchange', () => {
    const exchange = Exchange.uniswapV3('usdc', 3000)

    expect(exchange.name).toEqual('uniswap-v3-usdc-3000')
    expect(exchange.family).toEqual('uniswap-v3')
    expect(exchange.quoteAssetId).toEqual('usd-coin')
    expect(exchange.details).toEqual({ fee: 3000 })

    expect(Exchange.fromName(exchange.name)).toEqual(exchange)
  })
})
