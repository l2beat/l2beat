import {
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { BlockNumberUpdater } from '../../../src/core/BlockNumberUpdater'
import { Clock } from '../../../src/core/Clock'
import {
  EventUpdater,
  getAdjustedFrom,
} from '../../../src/core/events/EventUpdater'
import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'
import { setupDatabaseTestSuite } from '../../peripherals/database/shared/setup'

const START = UnixTime.fromDate(new Date('2022-08-09T00:00:00Z'))
const EVENT_A = 'event-a'
const PROJECT_A = ProjectId('project-a')

const MOCK_EVENT = {
  emitter: EthereumAddress.random(),
  topic: '#',
  name: EVENT_A,
  projectId: PROJECT_A,
  sinceTimestamp: UnixTime.now(),
  dbStatus: undefined,
}

const mockLog = (blockNumber: number) => {
  return {
    blockNumber,
    blockHash: '#',
    transactionIndex: 1,
    removed: false,
    address: EthereumAddress.random(),
    data: '#',
    topics: ['#'],
    transactionHash: '#',
    logIndex: 1,
  }
}

describe(EventUpdater.name, () => {
  describe(EventUpdater.prototype.start.name, () => {
    it('integration test', async () => {})
    it('changes last processed', async () => {})
  })

  describe(EventUpdater.prototype.update.name, () => {
    //or maybe integration test
    it('calls correctly from.add', async () => {})

    it('calls correctly and saves to db', async () => {})
  })

  describe(EventUpdater.prototype.fetchRecords.name, () => {
    it('adjusts from and calls correctly', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn().returnsOnce([]),
      })

      const blockNumberUpdater = mock<BlockNumberUpdater>({
        getBlockNumberWhenReady: mockFn().returns([]),
        getBlockRangeWhenReady: mockFn().returns([]),
      })

      const eventUpdater = new EventUpdater(
        ethereum,
        blockNumberUpdater,
        mock<EventRepository>({}),
        mock<Clock>(),
        [],
        Logger.SILENT,
      )

      const START = UnixTime.fromDate(new Date('2022-08-09T02:00:00Z'))

      await eventUpdater.fetchRecords(START, START.add(1, 'hours'), MOCK_EVENT)

      expect(
        blockNumberUpdater.getBlockRangeWhenReady,
      ).toHaveBeenCalledExactlyWith([
        [START.add(-1, 'hours'), START.add(1, 'hours')],
      ])

      expect(
        blockNumberUpdater.getBlockNumberWhenReady,
      ).toHaveBeenCalledExactlyWith([
        [START.add(-2, 'hours')],
        [START.add(1, 'hours')],
      ])
    })

    it('returns only from to', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn().returnsOnce([
          mockLog(50),
          mockLog(100),
          mockLog(200),
        ]),
      })

      const blockNumberUpdater = mock<BlockNumberUpdater>({
        getBlockNumberWhenReady: mockFn().returns([]),
        getBlockRangeWhenReady: mockFn().returns([
          { timestamp: START.add(1, 'hours'), blockNumber: 100n },
          { timestamp: START.add(2, 'hours'), blockNumber: 200n },
          { timestamp: START.add(3, 'hours'), blockNumber: 300n },
        ]),
      })

      const eventUpdater = new EventUpdater(
        ethereum,
        blockNumberUpdater,
        mock<EventRepository>({}),
        mock<Clock>(),
        [],
        Logger.SILENT,
      )

      const result = await eventUpdater.fetchRecords(
        START.add(2, 'hours'),
        START.add(3, 'hours'),
        MOCK_EVENT,
      )

      expect(result.map((r) => r.timestamp)).toEqual([
        START.add(2, 'hours'),
        START.add(3, 'hours'),
      ])
    })
  })

  describe(EventUpdater.prototype.getEventOccurrences.name, () => {
    it('ask for a block number of a 1 hour earlier', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn().returnsOnce([]),
      })

      const blockNumberUpdater = mock<BlockNumberUpdater>({
        getBlockNumberWhenReady: mockFn().returns(1),
      })

      const eventUpdater = new EventUpdater(
        ethereum,
        blockNumberUpdater,
        mock<EventRepository>({}),
        mock<Clock>(),
        [],
        Logger.SILENT,
      )
      await eventUpdater.getEventOccurrences(
        START,
        START.add(1, 'hours'),
        MOCK_EVENT,
      )

      expect(
        blockNumberUpdater.getBlockNumberWhenReady,
      ).toHaveBeenCalledExactlyWith([
        [START.add(-1, 'hours')],
        [START.add(1, 'hours')],
      ])
    })

    it('returns only blockNumbers', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn().returnsOnce([
          mockLog(100),
          mockLog(200),
          mockLog(300),
        ]),
      })

      const blockNumberUpdater = mock<BlockNumberUpdater>({
        getBlockNumberWhenReady: mockFn().returns(1),
      })

      const eventUpdater = new EventUpdater(
        ethereum,
        blockNumberUpdater,
        mock<EventRepository>({}),
        mock<Clock>(),
        [],
        Logger.SILENT,
      )

      const result = await eventUpdater.getEventOccurrences(
        START,
        START.add(1, 'hours'),
        MOCK_EVENT,
      )

      expect(result).toEqual([100n, 200n, 300n])
    })
  })

  describe(EventUpdater.prototype.getAllLogs.name, () => {
    it('divides on two calls', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })

      const eventUpdater = new EventUpdater(
        ethereum,
        mock<BlockNumberUpdater>({}),
        mock<EventRepository>({}),
        mock<Clock>(),
        [],
        Logger.SILENT,
      )
      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await eventUpdater.getAllLogs(address, topic, 1000, 2000)

      expect(ethereum.getLogs).toHaveBeenCalledExactlyWith([
        [address, [topic], 1000, 2000],
        [address, [topic], 1000, 1500],
        [address, [topic], 1501, 2000],
      ])
    })

    it('correctly divides range of two', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })

      const eventUpdater = new EventUpdater(
        ethereum,
        mock<BlockNumberUpdater>({}),
        mock<EventRepository>({}),
        mock<Clock>(),
        [],
        Logger.SILENT,
      )
      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await eventUpdater.getAllLogs(address, topic, 1, 2)

      expect(ethereum.getLogs).toHaveBeenCalledExactlyWith([
        [address, [topic], 1, 2],
        [address, [topic], 1, 1],
        [address, [topic], 2, 2],
      ])
    })

    it('fromBlock === toBlock', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .throwsOnce(new Error('Log response size exceeded')),
      })

      const { database } = setupDatabaseTestSuite()
      const eventsRepository = new EventRepository(database, Logger.SILENT)

      const eventUpdater = new EventUpdater(
        ethereum,
        mock<BlockNumberUpdater>({}),
        eventsRepository,
        mock<Clock>(),
        [],
        Logger.SILENT,
      )
      const address = EthereumAddress.random()
      const topic = 'aaaa'

      await expect(eventUpdater.getAllLogs(address, topic, 1, 1)).toBeRejected()

      expect(ethereum.getLogs).toHaveBeenCalledExactlyWith([
        [address, [topic], 1, 1],
      ])
    })
  })
})

describe(getAdjustedFrom.name, () => {
  it('00:00', () => {
    const from = UnixTime.fromDate(new Date('2022-08-09T00:00:00Z'))

    const result = getAdjustedFrom(from)

    expect(result).toEqual(from.add(-23, 'hours'))
  })

  it('01:00', () => {
    const from = UnixTime.fromDate(new Date('2022-08-09T01:00:00Z'))

    const result = getAdjustedFrom(from)

    expect(result).toEqual(from)
  })

  it('06:00', () => {
    const from = UnixTime.fromDate(new Date('2022-08-09T06:00:00Z'))

    const result = getAdjustedFrom(from)

    expect(result).toEqual(from.add(-5, 'hours'))
  })
})
