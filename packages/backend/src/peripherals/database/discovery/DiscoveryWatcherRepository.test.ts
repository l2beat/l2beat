import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../../test/database'
import { createMockRepoMetrics } from '../../../test/mocks/Metrics'
import {
  DiscoveryWatcherRecord,
  DiscoveryWatcherRepository,
} from './DiscoveryWatcherRepository'

describe(DiscoveryWatcherRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new DiscoveryWatcherRepository(
    database,
    Logger.SILENT,
    createMockRepoMetrics(),
  )

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(DiscoveryWatcherRepository.prototype.findLatest.name, async () => {
    const projectName = 'project'

    const expected: DiscoveryWatcherRecord = {
      projectName,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        blockNumber: -1,
        contracts: [],
        eoas: [],
        abis: {},
      },
    }

    await repository.addOrUpdate(expected)
    const result = await repository.findLatest(projectName)

    expect(result).toEqual(expected)
  })

  it(DiscoveryWatcherRepository.prototype.addOrUpdate.name, async () => {
    const projectName = 'project'

    const expected: DiscoveryWatcherRecord = {
      projectName,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        blockNumber: -1,
        contracts: [],
        eoas: [],
        abis: {},
      },
    }

    await repository.addOrUpdate(expected)
    const added = await repository.findLatest(projectName)

    expect(added).toEqual(expected)

    expected.blockNumber = 1
    await repository.addOrUpdate(expected)

    const updated = await repository.findLatest(projectName)
    expect(updated).toEqual(expected)
  })
})
