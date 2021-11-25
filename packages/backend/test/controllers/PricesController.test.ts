import { expect } from 'chai'

import { PricesController } from '../../src/controllers/PricesController'
import { AssetId, Exchange } from '../../src/model'
import { AggregatePriceRepository } from '../../src/peripherals/database/AggregatePriceRepository'
import { ExchangePriceRepository } from '../../src/peripherals/database/ExchangePriceRepository'
import { mock } from '../mock'

describe('PricesController', () => {
  it('returns transformed aggregate prices', async () => {
    const aggregatePriceRepository = mock<AggregatePriceRepository>({
      async getAllByAssetId(assetId) {
        expect(assetId).to.equal(AssetId.DAI)
        return [
          { blockNumber: 1n, priceUsd: 2n },
          { blockNumber: 3n, priceUsd: 4n },
        ]
      },
    })
    const exchangePriceRepository = mock<ExchangePriceRepository>()
    const pricesController = new PricesController(
      exchangePriceRepository,
      aggregatePriceRepository
    )
    expect(await pricesController.getPriceHistory(AssetId.DAI)).to.deep.equal([
      { blockNumber: '1', priceUsd: '2' },
      { blockNumber: '3', priceUsd: '4' },
    ])
  })

  it('returns transformed exchange prices', async () => {
    const aggregatePriceRepository = mock<AggregatePriceRepository>()
    const exchangePriceRepository = mock<ExchangePriceRepository>({
      async getAllByAssetIdAndExchange(assetId, exchange) {
        expect(assetId).to.equal(AssetId.DAI)
        expect(exchange).to.deep.equal(Exchange.uniswapV2('weth'))
        return [
          { blockNumber: 1n, price: 2n, liquidity: 3n },
          { blockNumber: 4n, price: 5n, liquidity: 6n },
        ]
      },
    })
    const pricesController = new PricesController(
      exchangePriceRepository,
      aggregatePriceRepository
    )
    expect(
      await pricesController.getPriceHistoryOnExchange(
        AssetId.DAI,
        Exchange.uniswapV2('weth')
      )
    ).to.deep.equal([
      { blockNumber: '1', price: '2', liquidity: '3' },
      { blockNumber: '4', price: '5', liquidity: '6' },
    ])
  })
})
