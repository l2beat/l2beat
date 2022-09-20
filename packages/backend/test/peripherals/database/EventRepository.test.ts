import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  EventRecord,
  EventRepository,
} from '../../../src/peripherals/database/EventRepository'
import { setupDatabaseTestSuite } from './shared/setup'

const START = UnixTime.fromDate(new Date('2022-05-17'))
const mockEvent = (
  offset: number,
  projectId: ProjectId,
  name: string,
): EventRecord => {
  return {
    timestamp: START.add(offset, 'hours'),
    name,
    projectId,
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

  describe(EventRepository.prototype.getByProject.name, () => {
    it('returns properly sorted records', async () => {
      const records = [
        mockEvent(2, PROJECT_A, EVENT_B),
        mockEvent(2, PROJECT_A, EVENT_A),
        mockEvent(1, PROJECT_A, EVENT_B),
        mockEvent(1, PROJECT_A, EVENT_A),
        mockEvent(0, PROJECT_A, EVENT_B),
        mockEvent(0, PROJECT_A, EVENT_A),
      ]
      await repository.addMany(records)

      const result = await repository.getByProject(PROJECT_A)

      expect(result).toEqual([
        mockEvent(0, PROJECT_A, EVENT_A),
        mockEvent(0, PROJECT_A, EVENT_B),
        mockEvent(1, PROJECT_A, EVENT_A),
        mockEvent(1, PROJECT_A, EVENT_B),
        mockEvent(2, PROJECT_A, EVENT_A),
        mockEvent(2, PROJECT_A, EVENT_B),
      ])
    })

    it('retrieves only given project', async () => {
      const records = [
        mockEvent(0, PROJECT_A, EVENT_A),
        mockEvent(0, PROJECT_B, EVENT_A),
      ]
      await repository.addMany(records)

      const result = await repository.getByProject(PROJECT_A)

      expect(result).toEqual([records[0]])
    })

    it('retrieves only records greater or equal a given timestamp', async () => {
      const records = [
        mockEvent(0, PROJECT_A, EVENT_A),
        mockEvent(1, PROJECT_A, EVENT_A),
        mockEvent(2, PROJECT_A, EVENT_A),
        mockEvent(3, PROJECT_A, EVENT_A),
      ]
      await repository.addMany(records)
      const allRecords = await repository.getByProject(PROJECT_A)
      const onlyFrom = await repository.getByProject(
        PROJECT_A,
        START.add(2, 'hours'),
      )

      expect(allRecords).toEqual(records)
      expect(onlyFrom).toEqual(records.slice(2))
    })
  })

  it(EventRepository.prototype.getByProjectAndName.name, async () => {
    const records = [
      mockEvent(0, PROJECT_A, EVENT_A),
      mockEvent(1, PROJECT_A, EVENT_A),

      mockEvent(0, PROJECT_A, EVENT_B),
      mockEvent(0, PROJECT_B, EVENT_A),
    ]

    await repository.addMany(records)

    const result = await repository.getByProjectAndName(PROJECT_A, EVENT_A)

    expect(result).toEqual([records[0], records[1]])
  })

  describe(EventRepository.prototype.getDataBoundary.name, () => {
    it('multiple records', async () => {
      const records = [
        mockEvent(0, PROJECT_A, EVENT_A),
        mockEvent(1, PROJECT_A, EVENT_A),
        mockEvent(2, PROJECT_A, EVENT_A),
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
