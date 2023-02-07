import { Logger } from '@l2beat/common'
import { Hash256, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../../test/database'
import { createMockRepoMetrics } from '../../../test/mocks/Metrics'
import {
  DiscoveryWatcherRecord,
  DiscoveryWatcherRepository,
} from './DiscoveryWatcherRepository'

const CONFIG_HASH = Hash256.random()

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

  it(DiscoveryWatcherRepository.prototype.addOrUpdate.name, async () => {
    const projectName = 'project'

    const discovery: DiscoveryWatcherRecord = {
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

    const updated: DiscoveryWatcherRecord = { ...discovery, blockNumber: 1 }
    await repository.addOrUpdate(updated)
    const latest = await repository.findLatest(projectName)

    expect(latest).toEqual(updated)
  })
})
