import { expect } from 'chai'

import { Exchange } from '../../../src/model'
import { ExchangePriceRepository } from '../../../src/peripherals/database/ExchangePriceRepository'
import { Logger } from '../../../src/tools/Logger'
import { setupDatabaseTestSuite } from './setup'

describe('ExchangePriceRepository', () => {
  const { knex } = setupDatabaseTestSuite()

  it('can delete all records', async () => {
    const repository = new ExchangePriceRepository(knex, Logger.SILENT)
    await repository.deleteAll()
    const results = await repository.getAll()
    expect(results).to.deep.equal([])
  })

  it('can add new records and query them by block number', async () => {
    const repository = new ExchangePriceRepository(knex, Logger.SILENT)

    const itemA = {
      blockNumber: 1234n,
      assetId: 'foo',
      exchange: Exchange.uniswapV1(),
      liquidity: 10_000n,
      price: 2137n,
    }
    const itemB = {
      blockNumber: 1234n,
      assetId: 'bar',
      exchange: Exchange.uniswapV2('dai'),
      liquidity: 20_000n,
      price: 1n,
    }
    const itemC = {
      blockNumber: 4567n,
      assetId: 'baz',
      exchange: Exchange.uniswapV3('usdc', 3000),
      liquidity: 25_000n,
      price: 2n,
    }

    await repository.add([itemA, itemB, itemC])

    const resultsA = await repository.getAllByBlockNumber(1234n)
    expect(resultsA).to.have.deep.members([itemA, itemB])

    const resultsB = await repository.getAllByBlockNumber(4567n)
    expect(resultsB).to.have.deep.members([itemC])
  })
})
