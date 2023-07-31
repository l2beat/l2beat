import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
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

    const expectedEth: UpdateMonitorRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: ChainId.getName(ChainId.ETHEREUM),
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

    const expectedArb: UpdateMonitorRecord = {
      projectName,
      chainId: ChainId.ARBITRUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: ChainId.getName(ChainId.ETHEREUM),
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
    await repository.addOrUpdate(expectedArb)

    const resultEth = await repository.findLatest(projectName, ChainId.ETHEREUM)
    const resultArb = await repository.findLatest(projectName, ChainId.ARBITRUM)

    expect(resultEth).toEqual(expectedEth)
    expect(resultArb).toEqual(expectedArb)
  })

  it(UpdateMonitorRepository.prototype.addOrUpdate.name, async () => {
    const projectName = 'project'

    const discovery: UpdateMonitorRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: ChainId.getName(ChainId.ETHEREUM),
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
    await repository.addOrUpdate(discovery)

    const updated: UpdateMonitorRecord = { ...discovery, blockNumber: 1 }
    await repository.addOrUpdate(updated)
    const latest = await repository.findLatest(projectName, ChainId.ETHEREUM)

    expect(latest).toEqual(updated)
  })
})
