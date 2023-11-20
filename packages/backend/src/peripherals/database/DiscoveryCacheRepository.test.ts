import { Logger } from '@l2beat/backend-tools'
import { ChainId } from '@l2beat/discovery'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import {
  DiscoveryCacheRecord,
  DiscoveryCacheRepository,
} from './DiscoveryCacheRepository'

describe(DiscoveryCacheRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new DiscoveryCacheRepository(database, Logger.SILENT)

  before(() => repository.deleteAll())
  afterEach(() => repository.deleteAll())

  it('adds single record and queries it', async () => {
    const record = mockRecord()
    await repository.addOrUpdate(record)
    const actual = await repository.getAll()
    expect(actual).toEqual([record])
  })

  it('only allows single record per key and overwrites old record with fresh data', async () => {
    const record1 = mockRecord({
      value: 'value1',
      chainId: ChainId.OPTIMISM,
      blockNumber: 1_000_000,
    })
    const record2 = mockRecord({
      value: 'value2',
      chainId: ChainId.OPTIMISM,
      blockNumber: 2_000_000,
    })

    await repository.addOrUpdate(record1)
    await repository.addOrUpdate(record2)
    const actual = await repository.getAll()
    expect(actual).toEqual([record2])
  })

  it('finds by key', async () => {
    const records = Array.from({ length: 10 }).map((_, i) =>
      mockRecord({
        key: `key${i}`,
        value: `value${i}`,
      }),
    )
    for (const record of records) {
      await repository.addOrUpdate(record)
    }
    const actual = await repository.findByKey('key1')
    expect(actual).toEqual({
      key: 'key1',
      value: 'value1',
      chainId: ChainId.ETHEREUM,
      blockNumber: 1_000_000,
    })
  })

  it('allows keys with length > 255', async () => {
    const record1 = mockRecord({
      value: 'a'.repeat(300),
    })

    await repository.addOrUpdate(record1)
  })
})

function mockRecord(record?: Partial<DiscoveryCacheRecord>) {
  return {
    key: 'key',
    value: 'value',
    chainId: ChainId.ETHEREUM,
    blockNumber: 1_000_000,
    ...record,
  }
}
