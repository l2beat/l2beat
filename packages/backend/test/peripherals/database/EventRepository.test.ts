import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { setupDatabaseTestSuite } from './shared/setup'

const START = UnixTime.fromDate(new Date('2022-05-17'))
const mockEvent = (
  offset: number,
  projectId: ProjectId,
  name: string,
  timeSpan: 'hourly' | 'sixHourly' | 'daily',
) => {
  return {
    timestamp: START.add(offset, 'hours'),
    name,
    projectId,
    count: 1,
    timeSpan,
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
      mockEvent(0, PROJECT_A, EVENT_A, 'hourly'),
      mockEvent(1, PROJECT_A, EVENT_A, 'hourly'),

      mockEvent(0, PROJECT_A, EVENT_B, 'hourly'),
      mockEvent(0, PROJECT_B, EVENT_A, 'hourly'),
      mockEvent(0, PROJECT_A, EVENT_A, 'daily'),
    ]

    await repository.addMany(records)

    const result = await repository.getByProjectAndName(
      PROJECT_A,
      EVENT_A,
      'hourly',
    )

    expect(result).toEqual([records[0], records[1]])
  })

  it(EventRepository.prototype.getAggregatedCount.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A, 'hourly'),
      mockEvent(1, PROJECT_A, EVENT_A, 'hourly'),
      mockEvent(2, PROJECT_A, EVENT_A, 'hourly'),
      mockEvent(3, PROJECT_A, EVENT_A, 'hourly'),
    ]

    await repository.addMany(records)

    const result = await repository.getAggregatedCount(
      PROJECT_A,
      EVENT_A,
      START,
      START.add(3, 'hours'),
    )

    expect(result).toEqual(4)
  })

  describe(EventRepository.prototype.getDataBoundary.name, () => {
    it('multiple records', async () => {
      const records = [
        mockEvent(0, PROJECT_A, EVENT_A, 'hourly'),
        mockEvent(1, PROJECT_A, EVENT_A, 'hourly'),
        mockEvent(2, PROJECT_A, EVENT_A, 'hourly'),
      ]

      await repository.addMany(records)

      const result = await repository.getDataBoundary()

      expect(result).toEqual(
        new Map([
          [
            `${PROJECT_A.toString()}-${EVENT_A}`,
            {
              earliest: START,
              latest: START.add(2, 'hours'),
            },
          ],
        ]),
      )
    })
  })

  it(EventRepository.prototype.addMany.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A, 'hourly'),
      mockEvent(0, PROJECT_B, EVENT_B, 'hourly'),
    ]

    await repository.addMany(records)

    const result = await repository.getAll()

    expect(result).toEqual(records)
  })

  it(EventRepository.prototype.deleteAll.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A, 'hourly'),
      mockEvent(0, PROJECT_B, EVENT_B, 'hourly'),
    ]

    await repository.addMany(records)

    await repository.deleteAll()

    const result = await repository.getAll()

    expect(result).toEqual([])
  })
})
