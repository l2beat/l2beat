import {
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { expect } from 'earljs'

import { Clock } from '../../../src/core/Clock'
import {
  EventUpdater,
  generateRecords,
} from '../../../src/core/events/EventUpdater'
import {
  EventRecord,
  EventRepository,
} from '../../../src/peripherals/database/EventRepository'
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
  describe(EventUpdater.prototype.getEventBlockNumbers.name, () => {
    it('two calls', async () => {
      const fromBlock = 1000
      const toBlock = 2000

      const ethereum = mock<EthereumClient>({
        getLogBlockNumbers: async (
          address: EthereumAddress,
          topics: string[],
          from: number,
          to: number,
        ): Promise<bigint[]> => {
          if (fromBlock === from && toBlock === to) {
            throw new Error('Log response size exceeded')
          }
          return [1n]
        },
      })

      const { database } = setupDatabaseTestSuite()
      const eventsRepository = new EventRepository(database, Logger.SILENT)

      const blockNumberUpdater = mock<BlockNumberUpdater>({})

      const eventUpdater = new EventUpdater(
        ethereum,
        blockNumberUpdater,
        eventsRepository,
        mock<Clock>(),
        [],
        Logger.SILENT,
      )
      const result = await eventUpdater.getEventBlockNumbers(
        EthereumAddress.random(),
        'aaaa',
        fromBlock,
        toBlock,
      )
      expect(result).toEqual([1n, 1n])
    })
  })
})

describe(generateRecords.name, () => {
  const NOON = new UnixTime(1660608000)
  const EVENT_A = 'event-a'
  const PROJECT_A = ProjectId('project-a')

  const mockEvent = () => {
    return {
      emitter: EthereumAddress.random(),
      topic: '#',
      name: EVENT_A,
      projectId: PROJECT_A,
      sinceTimestamp: UnixTime.now(),
      earliest: undefined,
      latest: undefined,
    }
  }

  const mockEventRecord = (
    offset: number,
    count: number,
    timeSpan: 'hourly' | 'sixHourly' | 'daily',
  ): EventRecord => {
    return {
      timestamp: NOON.add(offset, 'hours'),
      name: EVENT_A,
      projectId: PROJECT_A,
      count,
      timeSpan,
    }
  }

  it('empty', () => {})

  it('throw if first is not 1:00', () => {})

  it('simlpe case', async () => {
    const timestamps = [
      { timestamp: NOON.add(1, 'hours'), blockNumber: 100n },
      { timestamp: NOON.add(2, 'hours'), blockNumber: 200n },
      { timestamp: NOON.add(3, 'hours'), blockNumber: 300n },
    ]

    const logs = [1n, 50n, 100n, 150n, 200n, 250n]

    const result = generateRecords(mockEvent(), logs, timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 2, 'hourly'),
      mockEventRecord(2, 2, 'hourly'),
      mockEventRecord(3, 2, 'hourly'),
    ])
  })

  it('harder case', async () => {
    const timestamps = [
      { timestamp: NOON.add(1, 'hours'), blockNumber: 100n },
      { timestamp: NOON.add(2, 'hours'), blockNumber: 200n },
      { timestamp: NOON.add(3, 'hours'), blockNumber: 300n },
      { timestamp: NOON.add(4, 'hours'), blockNumber: 400n },
      { timestamp: NOON.add(5, 'hours'), blockNumber: 500n },
      { timestamp: NOON.add(6, 'hours'), blockNumber: 600n },
    ]

    const logs = [
      1n,
      50n,
      100n,
      150n,
      200n,
      250n,
      300n,
      350n,
      400n,
      450n,
      500n,
      550n,
    ]

    const result = generateRecords(mockEvent(), logs, timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 2, 'hourly'),
      mockEventRecord(2, 2, 'hourly'),
      mockEventRecord(3, 2, 'hourly'),
      mockEventRecord(4, 2, 'hourly'),
      mockEventRecord(5, 2, 'hourly'),
      mockEventRecord(6, 2, 'hourly'),
      mockEventRecord(6, 12, 'sixHourly'),
    ])
  })

  it('harder case', async () => {
    const timestamps = []
    const logs = []

    for (let i = 1; i <= 24; i++) {
      timestamps.push({
        timestamp: NOON.add(i, 'hours'),
        blockNumber: 100n * BigInt(i),
      })
      logs.push(BigInt(i - 1) * 100n, BigInt(i - 1) * 100n + 50n)
    }

    const result = generateRecords(mockEvent(), logs, timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 2, 'hourly'),
      mockEventRecord(2, 2, 'hourly'),
      mockEventRecord(3, 2, 'hourly'),
      mockEventRecord(4, 2, 'hourly'),
      mockEventRecord(5, 2, 'hourly'),
      mockEventRecord(6, 2, 'hourly'),
      mockEventRecord(7, 2, 'hourly'),
      mockEventRecord(8, 2, 'hourly'),
      mockEventRecord(9, 2, 'hourly'),
      mockEventRecord(10, 2, 'hourly'),
      mockEventRecord(11, 2, 'hourly'),
      mockEventRecord(12, 2, 'hourly'),
      mockEventRecord(13, 2, 'hourly'),
      mockEventRecord(14, 2, 'hourly'),
      mockEventRecord(15, 2, 'hourly'),
      mockEventRecord(16, 2, 'hourly'),
      mockEventRecord(17, 2, 'hourly'),
      mockEventRecord(18, 2, 'hourly'),
      mockEventRecord(19, 2, 'hourly'),
      mockEventRecord(20, 2, 'hourly'),
      mockEventRecord(21, 2, 'hourly'),
      mockEventRecord(22, 2, 'hourly'),
      mockEventRecord(23, 2, 'hourly'),
      mockEventRecord(24, 2, 'hourly'),
      mockEventRecord(6, 12, 'sixHourly'),
      mockEventRecord(12, 12, 'sixHourly'),
      mockEventRecord(18, 12, 'sixHourly'),
      mockEventRecord(24, 12, 'sixHourly'),
      mockEventRecord(24, 48, 'daily'),
    ])
  })
})
