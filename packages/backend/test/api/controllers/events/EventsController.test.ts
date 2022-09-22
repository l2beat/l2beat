import { Logger, mock } from '@l2beat/common'
import { Layer2Event } from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'

import { EventController } from '../../../../src/api/controllers/events/EventsController'
import { Clock } from '../../../../src/core/Clock'
import { Project } from '../../../../src/model'
import {
  EventRecord,
  EventRepository,
} from '../../../../src/peripherals/database/EventRepository'
import { setupDatabaseTestSuite } from '../../../peripherals/database/shared/setup'
const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

const EVENT_A = 'EventA'
const EVENT_B = 'EventB'

const START = UnixTime.fromDate(new Date('2022-05-17'))

describe(EventController.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new EventRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(EventController.prototype.getEvents.name, () => {
    it('gets data from db, transforms and returns', async () => {
      const records = [
        mockEventRecord(-14 * 24, PROJECT_A, EVENT_A),
        mockEventRecord(-14 * 24, PROJECT_A, EVENT_A),
        mockEventRecord(-14 * 24, PROJECT_A, EVENT_A),

        mockEventRecord(-14 * 24, PROJECT_B, EVENT_B),
        mockEventRecord(-14 * 24, PROJECT_B, EVENT_B),

        mockEventRecord(0, PROJECT_A, EVENT_A),
        mockEventRecord(0, PROJECT_A, EVENT_A),
        mockEventRecord(0, PROJECT_A, EVENT_A),

        mockEventRecord(0, PROJECT_B, EVENT_B),
        mockEventRecord(0, PROJECT_B, EVENT_B),
      ]
      await repository.addMany(records)

      const projects: Project[] = [
        mockProject(PROJECT_A, [EVENT_A]),
        mockProject(PROJECT_B, [EVENT_B]),
      ]

      const clock = mock<Clock>({
        getLastHour: mockFn().returns(START),
      })

      const eventController = new EventController(repository, clock, projects)

      const result = await eventController.getEvents()

      expect(result).toEqual({
        projects: {
          [PROJECT_A.toString()]: {
            hourly: {
              types: ['timestamp', EVENT_A],
              data: [[START, 3]],
            },
            daily: {
              types: ['timestamp', EVENT_A],
              data: [
                [START.add(-14, 'days'), 3],
                [START, 3],
              ],
            },
          },
          [PROJECT_B.toString()]: {
            hourly: {
              types: ['timestamp', EVENT_B],
              data: [[START, 2]],
            },
            daily: {
              types: ['timestamp', EVENT_B],
              data: [
                [START.add(-14, 'days'), 2],
                [START, 2],
              ],
            },
          },
        },
      })
    })
  })
})

const mockProject = (projectId: ProjectId, events: string[]): Project => {
  return {
    projectId,
    type: 'layer2',
    escrows: [],
    events: events.map((e) => mockEvent(e)),
  }
}
const mockEvent = (name: string): Layer2Event => {
  return {
    name: name,
    abi: `event ${name}()`,
    emitter: EthereumAddress.random(),
    type: 'state',
    sinceTimestamp: START.add(-365, 'days'),
  }
}

const mockEventRecord = (
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
