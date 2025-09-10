import { Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type UpdateMonitorRecord,
  UpdateMonitorRepository,
} from './UpdateMonitorRepository'

const CONFIG_HASH = Hash256.random()

describeDatabase(UpdateMonitorRepository.name, (db) => {
  const repository = db.updateMonitor

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UpdateMonitorRepository.prototype.findLatest.name, async () => {
    const projectId = 'project'

    const expectedEth: UpdateMonitorRecord = record()

    await repository.upsert(expectedEth)

    const resultEth = await repository.findLatest(projectId)

    expect(resultEth).toEqual(expectedEth)
  })

  it(UpdateMonitorRepository.prototype.upsert.name, async () => {
    const projectId = 'project'

    const discovery: UpdateMonitorRecord = {
      projectId,
      blockNumber: -1,
      timestamp: 0,
      discovery: {
        name: projectId,
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
    const latest = await repository.findLatest(projectId)

    expect(latest).toEqual(updated)
  })
})

function record(params?: Partial<UpdateMonitorRecord>): UpdateMonitorRecord {
  return {
    projectId: 'project',
    blockNumber: -1,
    timestamp: 0,
    discovery: {
      name: 'project',
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
