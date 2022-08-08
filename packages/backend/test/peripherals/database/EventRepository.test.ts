import { Logger, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { setupDatabaseTestSuite } from './shared/setup'

const START = UnixTime.fromDate(new Date('2022-05-17'))
const START_BN = 100_000n
const mockEvent = (offset: number, projectId: ProjectId, name: string) => {
  return {
    blockNumber: START_BN + BigInt(offset),
    timestamp: START.add(offset, 'days'),
    projectId,
    name,
  }
}

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

const EVENT_A = 'event-a'
const EVENT_B = 'event-b'

describe(EventRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new EventRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(EventRepository.prototype.getByProjectAndName.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A),
      mockEvent(0, PROJECT_A, EVENT_B),
      mockEvent(0, PROJECT_B, EVENT_A),
      mockEvent(0, PROJECT_B, EVENT_B),

      mockEvent(1, PROJECT_A, EVENT_A),
      mockEvent(1, PROJECT_A, EVENT_B),
      mockEvent(1, PROJECT_B, EVENT_A),
      mockEvent(1, PROJECT_B, EVENT_B),
    ]

    await repository.addMany(records)

    const result = await repository.getByProjectAndName(PROJECT_A, EVENT_A)

    expect(result).toEqual([records[0], records[4]])
  })

  it(EventRepository.prototype.addMany.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A),
      mockEvent(0, PROJECT_B, EVENT_B),
    ]

    await repository.addMany(records)

    const result = await repository.getAll()

    expect(result).toEqual(records)
  })

  it(EventRepository.prototype.deleteAll.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A),
      mockEvent(0, PROJECT_B, EVENT_B),
    ]

    await repository.addMany(records)

    await repository.deleteAll()

    const result = await repository.getAll()

    expect(result).toEqual([])
  })
})
