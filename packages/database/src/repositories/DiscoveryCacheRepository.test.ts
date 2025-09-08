import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type DiscoveryCacheRecord,
  DiscoveryCacheRepository,
} from './DiscoveryCacheRepository'

describeDatabase(DiscoveryCacheRepository.name, (db) => {
  const repository = db.discoveryCache

  before(() => repository.deleteAll())
  afterEach(() => repository.deleteAll())

  it('adds single record and queries it', async () => {
    const record = mockRecord()
    await repository.upsert(record)
    const actual = await repository.getAll()
    expect(actual).toEqual([record])
  })

  it('only allows single record per key and overwrites old record with fresh data', async () => {
    const record1 = mockRecord({ value: 'value1' })
    const record2 = mockRecord({ value: 'value2' })

    await repository.upsert(record1)
    await repository.upsert(record2)
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
      await repository.upsert(record)
    }
    const actual = await repository.findByKey('key1')
    expect(actual).toEqual({ key: 'key1', value: 'value1' })
  })

  it('allows keys with length > 255', async () => {
    const record1 = mockRecord({
      value: 'a'.repeat(300),
    })

    await repository.upsert(record1)
  })
})

function mockRecord(record?: Partial<DiscoveryCacheRecord>) {
  return {
    key: 'key',
    value: 'value',
    ...record,
  }
}
