import { Logger } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import {
  UpdateNotifierRecord,
  UpdateNotifierRepository,
} from './UpdateNotifierRepository'

const PROJECT = 'project'

describe(UpdateNotifierRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new UpdateNotifierRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UpdateNotifierRepository.prototype.findLatestId.name, async () => {
    const record = mockRecord(PROJECT)

    await repository.add(record)
    await repository.add(record)
    const latestId = await repository.add(record)

    const result = await repository.findLatestId()

    expect(result).toEqual(latestId)
  })

  it(UpdateNotifierRepository.prototype.add.name, async () => {
    const record = mockRecord(PROJECT)

    const latestId = await repository.add(record)

    const latest = await repository.findLatestId()

    expect(latest).toEqual(latestId)
  })
})

function mockRecord(
  projectName: string,
): Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'> {
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
