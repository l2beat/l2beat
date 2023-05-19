import { EthereumAddress, Logger, UnixTime } from '@l2beat/shared'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import {
  NotificationManagerRecord,
  NotificationManagerRepository,
} from './NotificationManagerRepository'

const PROJECT = 'project'

describe(NotificationManagerRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new NotificationManagerRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(NotificationManagerRepository.prototype.findLatest.name, async () => {
    const record = mockRecord(PROJECT)

    await repository.add(record)
    await repository.add(record)
    const addResult = await repository.add(record)
    const [lastId, timestamp] = addResult.split('-')

    const result = await repository.findLatest()

    expect(result).toEqual({
      ...record,
      id: +lastId,
      createdAt: new UnixTime(+timestamp),
      updatedAt: new UnixTime(+timestamp),
    })
  })

  it(NotificationManagerRepository.prototype.add.name, async () => {
    const record = mockRecord(PROJECT)

    const addResult = await repository.add(record)
    const [lastId, timestamp] = addResult.split('-')

    const latest = await repository.findLatest()

    expect(latest).toEqual({
      ...record,
      id: +lastId,
      createdAt: new UnixTime(+timestamp),
      updatedAt: new UnixTime(+timestamp),
    })
  })
})

function mockRecord(
  projectName: string,
): Omit<NotificationManagerRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    projectName,
    blockNumber: -1,
    diff: [
      {
        name: 'Contract',
        address: EthereumAddress.random(),
        diff: [
          {
            key: 'key',
            before: 'before',
            after: 'after',
          },
        ],
      },
    ],
  }
}
