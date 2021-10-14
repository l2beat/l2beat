import { expect } from 'chai'

import { AggregatePriceRepository } from '../../../src/peripherals/database/AggregatePriceRepository'
import { Logger } from '../../../src/tools/Logger'
import { setupDatabaseTestSuite } from './setup'

describe('AggregatePriceRepository', () => {
  const { knex } = setupDatabaseTestSuite()

  it('can delete all records', async () => {
    const repository = new AggregatePriceRepository(knex, Logger.SILENT)
    await repository.deleteAll()
    const results = await repository.getAll()
    expect(results).to.deep.equal([])
  })

  it('can add new records and query them by block number', async () => {
    const repository = new AggregatePriceRepository(knex, Logger.SILENT)

    const itemA = {
      blockNumber: 1234n,
      assetId: 'eth',
      priceUsd: 2137n,
    }
    const itemB = {
      blockNumber: 1234n,
      assetId: 'dai',
      priceUsd: 1n,
    }
    const itemC = {
      blockNumber: 4567n,
      assetId: 'dai',
      priceUsd: 2n,
    }

    await repository.add([itemA, itemB, itemC])

    const resultsA = await repository.getAllByBlockNumber(1234n)
    expect(resultsA).to.have.deep.members([itemA, itemB])

    const resultsB = await repository.getAllByBlockNumber(4567n)
    expect(resultsB).to.have.deep.members([itemC])
  })
})
