import { EthereumAddress, Logger, mock, UnixTime } from '@l2beat/common'
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

describe(EventUpdater.name, () => {
  describe(EventUpdater.prototype.start.name, () => {
    it('integration test', async () => {})
  })

  describe(EventUpdater.prototype.update.name, () => {
    it('calls correctly from.add', async () => {})

    it('saves to db', async () => {})

    it('changes last processed', async () => {})
  })

  describe(EventUpdater.prototype.fetchRecords.name, () => {
    it('adjusts from and call correctly', async () => {})

    it('returns only from to', async () => {})
  })

  describe(EventUpdater.prototype.getEventOccurrences.name, () => {
    it('ask for 1 hour earlier', async () => {
      //expect to be called with
    })

    it('returns only blockNumbers', async () => {})
  })

  describe(EventUpdater.prototype.getAllLogs.name, () => {
    it('divides on two calls', async () => {
      const ethereum = mock<EthereumClient>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
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
