import {
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { expect } from 'earljs'
import { mockFn } from 'earljs/dist/mocks'

import { Clock } from '../../../src/core/Clock'
import {
  EventUpdater,
  generateRecords,
  getRanges,
} from '../../../src/core/events/EventUpdater'
import { BlockNumberRepository } from '../../../src/peripherals/database/BlockNumberRepository'
import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'
import { setupDatabaseTestSuite } from '../../peripherals/database/shared/setup'

const START = UnixTime.fromDate(new Date('2022-08-09T00:00:00Z'))
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

const PROJECT_A = ProjectId('project')
const EVENT_A = 'Fake'
const ADDRESS = EthereumAddress.random()

const NOON = START.add(1, 'days')
const ONE_AM = START.add(1, 'hours')
const SIX_AM = START.add(6, 'hours')

describe(EventUpdater.name, () => {
  describe(EventUpdater.prototype.fetchRecords.name, () => {
    const ethereum = mock<EthereumClient>({
      getLogsCount: mockFn().returns(1),
    })

    const { database } = setupDatabaseTestSuite()
    const eventsRepository = new EventRepository(database, Logger.SILENT)

    beforeEach(async () => {
      await eventsRepository.deleteAll()
      const events = []
      for (let i = 0; i < 24; i++) {
        events.push(mockEvent(i, PROJECT_A, EVENT_A, 'hourly'))
      }
      await eventsRepository.addMany(events)
    })

    const blockNumberRepository = mock<BlockNumberRepository>({
      findByTimestamp: mockFn().returns(1),
    })

    const eventUpdater = new EventUpdater(
      ethereum,
      blockNumberRepository,
      eventsRepository,
      mock<Clock>(),
      [],
      Logger.SILENT,
    )

    const event = {
      emitter: ADDRESS,
      topic: EVENT_A,
      name: EVENT_A,
      projectId: PROJECT_A,
    }

    it('timestamp not sixHourly not daily', async () => {
      const result = await eventUpdater.fetchRecords(ONE_AM, event)

      expect(result).toEqual([
        {
          timestamp: ONE_AM,
          name: EVENT_A,
          projectId: PROJECT_A,
          count: 1,
          timeSpan: 'hourly',
        },
      ])
    })

    it('timestamp sixHourly not daily', async () => {
      const result = await eventUpdater.fetchRecords(SIX_AM, event)

      expect(result).toEqual([
        {
          timestamp: SIX_AM,
          name: EVENT_A,
          projectId: PROJECT_A,
          count: 1,
          timeSpan: 'hourly',
        },
        {
          timestamp: SIX_AM,
          name: EVENT_A,
          projectId: PROJECT_A,
          count: 6,
          timeSpan: 'sixHourly',
        },
      ])
    })

    it('timestamp daily', async () => {
      const result = await eventUpdater.fetchRecords(NOON, event)

      expect(result).toEqual([
        {
          timestamp: NOON,
          name: EVENT_A,
          projectId: PROJECT_A,
          count: 1,
          timeSpan: 'hourly',
        },
        {
          timestamp: NOON,
          name: EVENT_A,
          projectId: PROJECT_A,
          count: 6,
          timeSpan: 'sixHourly',
        },
        {
          timestamp: NOON,
          name: EVENT_A,
          projectId: PROJECT_A,
          count: 24,
          timeSpan: 'daily',
        },
      ])
    })
  })

  describe(generateRecords.name, () => {
    it('empty', () => {})

    it('throw if first is not 1:00', () => {})

    it('works', async () => {
      const NOON = new UnixTime(1660608000)
      const timestamps = [
        { timestamp: NOON, blockNumber: 1n },
        { timestamp: NOON.add(1, 'hours'), blockNumber: 100n },
        { timestamp: NOON.add(2, 'hours'), blockNumber: 200n },
        { timestamp: NOON.add(3, 'hours'), blockNumber: 300n },
        { timestamp: NOON.add(4, 'hours'), blockNumber: 400n },
        { timestamp: NOON.add(5, 'hours'), blockNumber: 500n },
        { timestamp: NOON.add(6, 'hours'), blockNumber: 600n },
      ]

      const logs = [50n, 100n, 150n, 200n, 250n, 300n, 350n, 400n, 450n, 500n]

      const result = await generateRecords(
        {
          name: 'X',
          project: PROJECT_A,
        },
        logs,
        timestamps,
      )

      expect(result).toEqual([])
    })
  })
})


