import { mock } from '@l2beat/common'
import { Layer2Event } from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'

import {
  EventController,
  getEndpointConfig,
} from '../../../../src/api/controllers/events/EventsController'
import {
  getHourlyMinTimestamp,
  getSixHourlyMinTimestamp,
} from '../../../../src/api/controllers/report/charts'
import { EventUpdater } from '../../../../src/core/events/EventUpdater'
import { ProjectInfo } from '../../../../src/model'
import {
  EventGranularity,
  EventRecord,
  EventRepository,
} from '../../../../src/peripherals/database/EventRepository'
const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

const EVENT_A = 'EventA'
const MOCK_TYPES: ['timestamp', ...string[]] = ['timestamp', EVENT_A]

const START = UnixTime.fromDate(new Date('2022-05-17'))

const mockProject = (name: ProjectId): ProjectInfo => {
  return {
    name: name.toString(),
    projectId: name,
    escrows: [],
    events: [mockEvent(EVENT_A)],
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
  name: string,
  granularity: EventGranularity,
): EventRecord => {
  return {
    timestamp: START.add(offset, 'days'),
    name,
    projectId: ProjectId('random'),
    count: 1,
    granularity,
  }
}

describe(EventController.name, () => {
  it('config integrates with database, return result', async () => {
    const eventRepository = mock<EventRepository>({
      getByProject: mockFn()
        .returnsOnce([mockEventRecord(179, EVENT_A, 'hourly')])
        .returnsOnce([mockEventRecord(90, EVENT_A, 'sixHourly')])
        .returnsOnce([mockEventRecord(0, EVENT_A, 'daily')])
        .returnsOnce([mockEventRecord(179, EVENT_A, 'hourly')])
        .returnsOnce([mockEventRecord(90, EVENT_A, 'sixHourly')])
        .returnsOnce([mockEventRecord(0, EVENT_A, 'daily')]),
    })
    const eventUpdater = mock<EventUpdater>({
      getLastProcessed: mockFn().returns(START.add(180, 'days')),
    })
    const projects: ProjectInfo[] = [
      mockProject(PROJECT_A),
      mockProject(PROJECT_B),
    ]

    const eventController = new EventController(
      eventRepository,
      eventUpdater,
      projects,
    )

    const result = await eventController.getEvents()

    expect(result).toEqual({
      projects: {
        [PROJECT_A.toString()]: {
          hourly: {
            types: MOCK_TYPES,
            data: [[START.add(179, 'days'), 1]],
          },
          sixHourly: { types: MOCK_TYPES, data: [[START.add(90, 'days'), 1]] },
          daily: { types: MOCK_TYPES, data: [[START, 1]] },
        },

        [PROJECT_B.toString()]: {
          hourly: {
            types: MOCK_TYPES,
            data: [[START.add(179, 'days'), 1]],
          },
          sixHourly: { types: MOCK_TYPES, data: [[START.add(90, 'days'), 1]] },
          daily: { types: MOCK_TYPES, data: [[START, 1]] },
        },
      },
    })

    expect(eventRepository.getByProject).toHaveBeenCalledExactlyWith([
      [PROJECT_A, 'hourly', START.add(173, 'days')],
      [PROJECT_A, 'sixHourly', START.add(90, 'days')],
      [PROJECT_A, 'daily', undefined],
      [PROJECT_B, 'hourly', START.add(173, 'days')],
      [PROJECT_B, 'sixHourly', START.add(90, 'days')],
      [PROJECT_B, 'daily', undefined],
    ])
  })
})

describe(getEndpointConfig.name, () => {
  it('returns config for timestamp', () => {
    const timestamp = UnixTime.fromDate(new Date('2022-05-17'))

    const result = getEndpointConfig(timestamp)

    expect(result).toEqual([
      { granularity: 'hourly', timestamp: getHourlyMinTimestamp(timestamp) },
      {
        granularity: 'sixHourly',
        timestamp: getSixHourlyMinTimestamp(timestamp),
      },
      { granularity: 'daily', timestamp: undefined },
    ])
  })
})
