import { expect } from 'chai'

import { Exchange } from '../../src/model'

describe('Exchange', () => {
  it('can represent a Uniswap V1 exchange', () => {
    const exchange = Exchange.uniswapV1()

    expect(exchange.name).to.equal('uniswap-v1')
    expect(exchange.family).to.equal('uniswap-v1')
    expect(exchange.quoteAssetId).to.equal('ether')
    expect(exchange.details).to.deep.equal({})

    expect(Exchange.fromName(exchange.name)).to.deep.equal(exchange)
  })

  it('can represent a Uniswap V2 exchange', () => {
    const exchange = Exchange.uniswapV2('dai')

    expect(exchange.name).to.equal('uniswap-v2-dai')
    expect(exchange.family).to.equal('uniswap-v2')
    expect(exchange.quoteAssetId).to.equal('dai-stablecoin')
    expect(exchange.details).to.deep.equal({})

    expect(Exchange.fromName(exchange.name)).to.deep.equal(exchange)
  })

  it('can represent a Uniswap V3 exchange', () => {
    const exchange = Exchange.uniswapV3('usdc', 3000)

    expect(exchange.name).to.equal('uniswap-v3-usdc-3000')
    expect(exchange.family).to.equal('uniswap-v3')
    expect(exchange.quoteAssetId).to.equal('usd-coin')
    expect(exchange.details).to.deep.equal({ fee: 3000 })

    expect(Exchange.fromName(exchange.name)).to.deep.equal(exchange)
  })
})
