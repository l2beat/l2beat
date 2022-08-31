import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  UptimeRecord,
  UptimeRepository,
} from '../../../src/peripherals/database/UptimeRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(UptimeRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new UptimeRepository(database, Logger.SILENT)

  const NOW = UnixTime.now()
  const LATER = NOW.add(1, 'hours')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UptimeRepository.prototype.addMany.name, async () => {
    const UPTIMES = [
      fakeUptime({ timestamp: NOW }),
      fakeUptime({ timestamp: LATER }),
    ]
    await repository.addMany(UPTIMES)
    expect(await repository.getAll()).toEqual(UPTIMES)
  })

  it(UptimeRepository.prototype.deleteAll.name, async () => {
    const UPTIMES = [fakeUptime(), fakeUptime()]
    await repository.addMany(UPTIMES)
    await repository.deleteAll()
    expect(await repository.getAll()).toEqual([])
  })
})

function fakeUptime(uptime?: Partial<UptimeRecord>): UptimeRecord {
  const active = Math.random() > 0.5
  return {
    timestamp: UnixTime.now(),
    projectId: ProjectId('fake-project'),
    strategyId: 'fake-project-1',
    active,
    error: active ? undefined : 'fake-error',
    latency: active ? Math.floor(Math.random() * 1000) : undefined,
    ...uptime,
  }
}
