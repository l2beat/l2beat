import { ChainId, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import type { UpdateMonitorRecord } from './entity'
import { UpdateMonitorRepository } from './repository'

const CONFIG_HASH = Hash256.random()

describeDatabase(UpdateMonitorRepository.name, (db) => {
  const repository = db.updateMonitor

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UpdateMonitorRepository.prototype.findLatest.name, async () => {
    const projectId = 'project'

    const expectedEth: UpdateMonitorRecord = record()
    const expectedArb: UpdateMonitorRecord = record({
      chainId: ChainId.ARBITRUM,
    })

    await repository.upsert(expectedEth)
    await repository.upsert(expectedArb)

    const resultEth = await repository.findLatest(projectId, ChainId.ETHEREUM)
    const resultArb = await repository.findLatest(projectId, ChainId.ARBITRUM)

    expect(resultEth).toEqual(expectedEth)
    expect(resultArb).toEqual(expectedArb)
  })

  it(UpdateMonitorRepository.prototype.upsert.name, async () => {
    const projectId = 'project'

    const discovery: UpdateMonitorRecord = {
      projectId,
      chainId: ChainId.ETHEREUM,
      blockNumber: -1,
      timestamp: 0,
      discovery: {
        name: projectId,
        chain: 'ethereum',
        blockNumber: -1,
        timestamp: -1,
        configHash: Hash256.random(),
        entries: [],
        abis: {},
        usedTemplates: {},
        usedBlockNumbers: {},
      },
      configHash: CONFIG_HASH,
    }
    await repository.upsert(discovery)

    const updated: UpdateMonitorRecord = {
      ...discovery,
      blockNumber: 1,
      timestamp: 1,
    }
    await repository.upsert(updated)
    const latest = await repository.findLatest(projectId, ChainId.ETHEREUM)

    expect(latest).toEqual(updated)
  })
})

function record(params?: Partial<UpdateMonitorRecord>): UpdateMonitorRecord {
  return {
    projectId: 'project',
    chainId: ChainId.ETHEREUM,
    blockNumber: -1,
    timestamp: 0,
    discovery: {
      name: 'project',
      chain: 'ethereum',
      blockNumber: -1,
      timestamp: -1,
      configHash: Hash256.random(),
      entries: [],
      abis: {},
      usedTemplates: {},
      usedBlockNumbers: {},
    },
    configHash: CONFIG_HASH,
    ...params,
  }
}
