import { EthereumAddress, Logger } from '@l2beat/shared'
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

  it(NotificationManagerRepository.prototype.findLatestId.name, async () => {
    const record = mockRecord(PROJECT)

    await repository.add(record)
    await repository.add(record)
    const latestId = await repository.add(record)

    const result = await repository.findLatestId()

    expect(result).toEqual(latestId)
  })

  it(NotificationManagerRepository.prototype.add.name, async () => {
    const record = mockRecord(PROJECT)

    const latestId = await repository.add(record)

    const latest = await repository.findLatestId()

    expect(latest).toEqual(latestId)
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
