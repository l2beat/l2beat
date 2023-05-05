import { Hash256, Logger, UnixTime } from '@l2beat/shared'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import {
  UpdateMonitorRecord,
  UpdateMonitorRepository,
} from './UpdateMonitorRepository'

const CONFIG_HASH = Hash256.random()

describe(UpdateMonitorRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new UpdateMonitorRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UpdateMonitorRepository.prototype.findLatest.name, async () => {
    const projectName = 'project'

    const expected: UpdateMonitorRecord = {
      projectName,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
      },
      configHash: CONFIG_HASH,
    }

    await repository.addOrUpdate(expected)
    const result = await repository.findLatest(projectName)

    expect(result).toEqual(expected)
  })

  it(UpdateMonitorRepository.prototype.addOrUpdate.name, async () => {
    const projectName = 'project'

    const discovery: UpdateMonitorRecord = {
      projectName,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
      },
      configHash: CONFIG_HASH,
    }
    await repository.addOrUpdate(discovery)

    const updated: UpdateMonitorRecord = { ...discovery, blockNumber: 1 }
    await repository.addOrUpdate(updated)
    const latest = await repository.findLatest(projectName)

    expect(latest).toEqual(updated)
  })
})
