import { Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { BlockNumberRepository } from '../../../src/peripherals/database/BlockNumberRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(BlockNumberRepository.name, () => {
  const { database } = setupDatabaseTestSuite()

  it('can delete all records', async () => {
    const repository = new BlockNumberRepository(database, Logger.SILENT)
    await repository.deleteAll()
    const results = await repository.getAll()
    expect(results).toEqual([])
  })

  it('can add new records', async () => {
    const repository = new BlockNumberRepository(database, Logger.SILENT)

    const itemA = { blockNumber: 1234n, timestamp: new UnixTime(5678) }
    const itemB = { blockNumber: 7777n, timestamp: new UnixTime(222222) }

    await repository.add(itemA)
    await repository.add(itemB)

    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(itemA, itemB)
    expect(results.length).toEqual(2)
  })
})
