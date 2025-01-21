import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
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
    const projectName = 'project'

    const expectedEth: UpdateMonitorRecord = record()
    const expectedArb: UpdateMonitorRecord = record({
      chainId: ChainId.ARBITRUM,
    })

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
        usedTemplates: {},
      },
      configHash: CONFIG_HASH,
    }
    await repository.upsert(discovery)

    const updated: UpdateMonitorRecord = { ...discovery, blockNumber: 1 }
    await repository.upsert(updated)
    const latest = await repository.findLatest(projectName, ChainId.ETHEREUM)

    expect(latest).toEqual(updated)
  })
})

function record(params?: Partial<UpdateMonitorRecord>): UpdateMonitorRecord {
  return {
    projectName: 'project',
    chainId: ChainId.ETHEREUM,
    blockNumber: -1,
    timestamp: new UnixTime(0),
    discovery: {
      name: 'project',
      chain: 'ethereum',
      blockNumber: -1,
      configHash: Hash256.random(),
      contracts: [],
      eoas: [],
      abis: {},
      usedTemplates: {},
    },
    configHash: CONFIG_HASH,
    ...params,
  }
}
