import { Logger, UnixTime } from '@l2beat/shared'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../test/database'
import { BlockNumberRepository } from './BlockNumberRepository'

describe(BlockNumberRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BlockNumberRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('can add new records', async () => {
    const itemA = { blockNumber: 1234, timestamp: new UnixTime(5678) }
    const itemB = { blockNumber: 7777, timestamp: new UnixTime(222222) }

    await repository.add(itemA)
    await repository.add(itemB)

    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(itemA, itemB)
    expect(results.length).toEqual(2)
  })

  it('can find by timestamp', async () => {
    const itemA = { blockNumber: 1234, timestamp: new UnixTime(5678) }
    const itemB = { blockNumber: 7777, timestamp: new UnixTime(222222) }

    await repository.add(itemA)
    await repository.add(itemB)

    const result = await repository.findByTimestamp(new UnixTime(222222))
    expect(result).toEqual(itemB)
  })

  it('can delete all records', async () => {
    await repository.add({ blockNumber: 1, timestamp: new UnixTime(1) })
    await repository.deleteAll()

    const results = await repository.getAll()
    expect(results).toEqual([])
  })
})
