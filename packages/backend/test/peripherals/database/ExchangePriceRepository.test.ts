import { expect } from 'earljs'

import { AssetId, Exchange } from '../../../src/model'
import { ExchangePriceRepository } from '../../../src/peripherals/database/ExchangePriceRepository'
import { Logger } from '../../../src/tools/Logger'
import { setupDatabaseTestSuite } from './setup'

describe(ExchangePriceRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()

  it('can delete all records', async () => {
    const repository = new ExchangePriceRepository(knex, Logger.SILENT)
    await repository.deleteAll()
    const results = await repository.getAll()
    expect(results).toEqual([])
  })

  it('can add new records and query them by block number', async () => {
    const repository = new ExchangePriceRepository(knex, Logger.SILENT)

    const itemA = {
      blockNumber: 1234n,
      assetId: AssetId('foo'),
      exchange: Exchange.uniswapV1(),
      liquidity: 10_000n,
      price: 2137n,
    }
    const itemB = {
      blockNumber: 1234n,
      assetId: AssetId('bar'),
      exchange: Exchange.uniswapV2('dai'),
      liquidity: 20_000n,
      price: 1n,
    }
    const itemC = {
      blockNumber: 4567n,
      assetId: AssetId('baz'),
      exchange: Exchange.uniswapV3('usdc', 3000),
      liquidity: 25_000n,
      price: 2n,
    }

    await repository.add([itemA, itemB, itemC])

    const resultsA = await repository.getAllByBlockNumber(1234n)
    expect(resultsA).toBeAnArrayWith(itemA, itemB)
    expect(resultsA.length).toEqual(2)

    const resultsB = await repository.getAllByBlockNumber(4567n)
    expect(resultsB).toBeAnArrayWith(itemC)
    expect(resultsB.length).toEqual(1)
  })

  it('getAllByAssetIdAndExchange', async () => {
    const repository = new ExchangePriceRepository(knex, Logger.SILENT)
    await repository.deleteAll()

    await repository.add([
      {
        blockNumber: 1234n,
        assetId: AssetId.WETH,
        exchange: Exchange.uniswapV2('dai'),
        liquidity: 1000n,
        price: 2137n,
      },
      {
        blockNumber: 1235n,
        assetId: AssetId.DAI,
        exchange: Exchange.uniswapV2('usdt'),
        liquidity: 2000n,
        price: 420n,
      },
      {
        blockNumber: 1233n,
        assetId: AssetId.DAI,
        exchange: Exchange.uniswapV2('usdt'),
        liquidity: 3000n,
        price: 69n,
      },
      {
        blockNumber: 1232n,
        assetId: AssetId.DAI,
        exchange: Exchange.uniswapV2('weth'),
        liquidity: 3000n,
        price: 1337n,
      },
    ])

    const results = await repository.getAllByAssetIdAndExchange(
      AssetId.DAI,
      Exchange.uniswapV2('usdt')
    )
    expect(results).toEqual([
      {
        blockNumber: 1233n,
        liquidity: 3000n,
        price: 69n,
      },
      {
        blockNumber: 1235n,
        liquidity: 2000n,
        price: 420n,
      },
    ])
  })
})
