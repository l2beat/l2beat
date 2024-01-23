import { Logger } from '@l2beat/backend-tools'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import {
  DiscoveryHistoryRecord,
  DiscoveryHistoryRepository,
} from './DiscoveryHistoryRepository'

const CONFIG_HASH = Hash256.random()

describe(DiscoveryHistoryRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new DiscoveryHistoryRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(DiscoveryHistoryRepository.prototype.findLatest.name, async () => {
    const projectName = 'project'

    const expectedEth: DiscoveryHistoryRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: 1,
      timestamp: new UnixTime(1),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    const secondEth: DiscoveryHistoryRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: 0,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    const expectedArb: DiscoveryHistoryRecord = {
      projectName,
      chainId: ChainId.ARBITRUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    await repository.addOrUpdate(expectedEth)
    await repository.addOrUpdate(secondEth)
    await repository.addOrUpdate(expectedArb)

    const resultEth = await repository.findLatest(projectName, ChainId.ETHEREUM)
    const resultArb = await repository.findLatest(projectName, ChainId.ARBITRUM)

    expect(resultEth).toEqual(expectedEth)
    expect(resultArb).toEqual(expectedArb)
  })

  it(DiscoveryHistoryRepository.prototype.getTimestamps.name, async () => {
    const projectName = 'project'

    const discovery: DiscoveryHistoryRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
      },
      configHash: CONFIG_HASH,
      version: 0,
    }
    const discovery2 = {
      ...discovery,
      timestamp: new UnixTime(2),
    }
    await repository.addOrUpdate(discovery)
    await repository.addOrUpdate(discovery2)
    const timestamps = await repository.getTimestamps(
      projectName,
      ChainId.ETHEREUM,
    )

    expect(timestamps).toEqual([discovery.timestamp, discovery2.timestamp])
  })
})
