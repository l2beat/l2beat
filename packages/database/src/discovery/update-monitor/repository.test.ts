import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { UpdateMonitorRecord } from './entity'
import { UpdateMonitorRepository } from './repository'

const CONFIG_HASH = Hash256.random()

describeDatabase(UpdateMonitorRepository.name, (db) => {
  const repository = db.updateMonitor

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
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
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
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    await repository.upsert(expectedEth)
    await repository.upsert(expectedArb)

    const resultEth = await repository.findLatest(projectName, ChainId.ETHEREUM)
    const resultArb = await repository.findLatest(projectName, ChainId.ARBITRUM)

    expect(resultEth).toEqual(expectedEth)
    expect(resultArb).toEqual(expectedArb)
  })

  it(UpdateMonitorRepository.prototype.upsert.name, async () => {
    const projectName = 'project'

    const discovery: UpdateMonitorRecord = {
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
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      },
      configHash: CONFIG_HASH,
      version: 0,
    }
    await repository.upsert(discovery)

    const updated: UpdateMonitorRecord = { ...discovery, blockNumber: 1 }
    await repository.upsert(updated)
    const latest = await repository.findLatest(projectName, ChainId.ETHEREUM)

    expect(latest).toEqual(updated)
  })
})
