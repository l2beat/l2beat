import { AssetId, Exchange } from '@l2beat/common'
import { expect } from 'earljs'

import { PricesController } from '../../../src/api/controllers/PricesController'
import { AggregatePriceRepository } from '../../../src/peripherals/database/AggregatePriceRepository'
import { ExchangePriceRepository } from '../../../src/peripherals/database/ExchangePriceRepository'
import { mock } from '../../mock'

describe(PricesController.name, () => {
  it('returns transformed aggregate prices', async () => {
    const aggregatePriceRepository = mock<AggregatePriceRepository>({
      async getAllByAssetId(assetId) {
        expect(assetId).toEqual(AssetId.DAI)
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
    expect<unknown>(
      await pricesController.getPriceHistory(AssetId.DAI)
    ).toEqual([
      { blockNumber: '1', priceUsd: '2' },
      { blockNumber: '3', priceUsd: '4' },
    ])
  })

  it('returns transformed exchange prices', async () => {
    const aggregatePriceRepository = mock<AggregatePriceRepository>()
    const exchangePriceRepository = mock<ExchangePriceRepository>({
      async getAllByAssetIdAndExchange(assetId, exchange) {
        expect(assetId).toEqual(AssetId.DAI)
        expect(exchange).toEqual(Exchange.uniswapV2('weth'))
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
    expect<unknown>(
      await pricesController.getPriceHistoryOnExchange(
        AssetId.DAI,
        Exchange.uniswapV2('weth')
      )
    ).toEqual([
      { blockNumber: '1', price: '2', liquidity: '3' },
      { blockNumber: '4', price: '5', liquidity: '6' },
    ])
  })
})
