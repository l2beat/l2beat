import { Logger, mock } from '@l2beat/common'
import { ProjectEvent } from '@l2beat/config/build/src/projects/types/ProjectEvent'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BlockNumberUpdater } from '../../../src/core/BlockNumberUpdater'
import { Clock } from '../../../src/core/Clock'
import {
  EventUpdater,
  getAdjustedFrom,
} from '../../../src/core/events/EventUpdater'
import { generateEventRecords } from '../../../src/core/events/generateEventRecords'
import { ProjectInfo } from '../../../src/model'
import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'

const START = UnixTime.fromDate(new Date('2022-08-09T00:00:00Z'))
const PROJECT_A = ProjectId('project-a')

const EVENT_A: ProjectEvent = {
  name: 'A',
  abi: 'event A()',
  emitter: EthereumAddress.random(),
  type: 'state',
  sinceTimestamp: START.add(-365, 'days'),
}

const DETAILS_EVENT_A = {
  emitter: EVENT_A.emitter,
  topic: '0xf446c1d0ceceeffa77e664bc78fba57853bda372d626a510062480375fa80e90',
  name: 'A',
  projectId: PROJECT_A,
  sinceTimestamp: EVENT_A.sinceTimestamp,
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
    it('triggers update now and on every new hour', async () => {
      const clock = mock<Clock>({
        onNewHour(callback) {
          callback(START.add(1, 'hours'))
          callback(START.add(1, 'hours'))
          return () => {}
        },
      })

      const eventUpdater = new EventUpdater(
        mock<EthereumClient>({}),
        mock<BlockNumberUpdater>({}),
        mock<EventRepository>({}),
        clock,
        [],
        Logger.SILENT,
      )

      const update = mockFn<typeof eventUpdater.update>().resolvesTo(undefined)
      eventUpdater.update = update

      eventUpdater.start()

      await waitForExpect(() => {
        expect(update.calls.length).toEqual(3)
      })
    })
  })

  describe(EventUpdater.prototype.update.name, () => {
    it('correctly calls fetchRecords() ', async () => {
      const eventRepository = mock<EventRepository>({
        addMany: mockFn().returns([]),
        getDataBoundary: mockFn().returns(new Map([])),
      })

      const projects: ProjectInfo[] = [
        {
          name: PROJECT_A.toString(),
          projectId: PROJECT_A,
          bridges: [],
          events: [EVENT_A],
        },
      ]

      const clock = mock<Clock>({
        getFirstHour: mockFn().returns(START.add(-1, 'days')),
        getLastHour: mockFn().returns(START.add(2, 'hours')),
      })

      const eventUpdater = new EventUpdater(
        mock<EthereumClient>({}),
        mock<BlockNumberUpdater>({}),
        eventRepository,
        clock,
        projects,
        Logger.SILENT,
      )

      const fetchRecords = mockFn<
        typeof eventUpdater.fetchRecords
      >().resolvesTo([])
      eventUpdater.fetchRecords = fetchRecords

      await eventUpdater.update()

      expect(fetchRecords).toHaveBeenCalledExactlyWith([
        [START, START.add(2, 'hours'), DETAILS_EVENT_A],
      ])
    })

    it('saves to db', async () => {
      const ethereumClient = mock<EthereumClient>({
        getLogsUsingBisection: mockFn().returnsOnce([
          mockLog(50),
          mockLog(150),
          mockLog(250),
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

      const eventRepository = mock<EventRepository>({
        addMany: mockFn().returns([]),
        getDataBoundary: mockFn().returns(new Map([])),
      })

      const projects: ProjectInfo[] = [
        {
          name: PROJECT_A.toString(),
          projectId: PROJECT_A,
          bridges: [],
          events: [EVENT_A],
        },
      ]

      const clock = mock<Clock>({
        getFirstHour: mockFn().returns(START.add(-1, 'days')),
        getLastHour: mockFn().returns(START.add(2, 'hours')),
      })

      const eventUpdater = new EventUpdater(
        ethereumClient,
        blockNumberUpdater,
        eventRepository,
        clock,
        projects,
        Logger.SILENT,
      )

      await eventUpdater.update()

      const records = generateEventRecords(
        DETAILS_EVENT_A,
        [50n, 150n, 250n],
        [
          { timestamp: START.add(1, 'hours'), blockNumber: 100n },
          { timestamp: START.add(2, 'hours'), blockNumber: 200n },
          { timestamp: START.add(3, 'hours'), blockNumber: 300n },
        ],
      )
      expect(eventRepository.addMany).toHaveBeenCalledExactlyWith([[records]])
    })

    it('updates lastProcessed timestamp', async () => {
      const eventRepository = mock<EventRepository>({
        addMany: mockFn().returns([]),
        getDataBoundary: mockFn().returns(new Map([])),
      })

      const projects: ProjectInfo[] = [
        {
          name: PROJECT_A.toString(),
          projectId: PROJECT_A,
          bridges: [],
          events: [EVENT_A],
        },
      ]

      const clock = mock<Clock>({
        getFirstHour: mockFn().returns(START.add(-1, 'days')),
        getLastHour: mockFn()
          .returnsOnce(START.add(2, 'hours'))
          .returnsOnce(START.add(3, 'hours')),
      })

      const eventUpdater = new EventUpdater(
        mock<EthereumClient>({}),
        mock<BlockNumberUpdater>({}),
        eventRepository,
        clock,
        projects,
        Logger.SILENT,
      )

      const fetchRecords = mockFn<
        typeof eventUpdater.fetchRecords
      >().resolvesTo([])
      eventUpdater.fetchRecords = fetchRecords

      await eventUpdater.update()
      await eventUpdater.update()

      expect(fetchRecords).toHaveBeenCalledExactlyWith([
        [START, START.add(2, 'hours'), DETAILS_EVENT_A],
        [START.add(3, 'hours'), START.add(3, 'hours'), DETAILS_EVENT_A],
      ])
    })
  })

  describe(EventUpdater.prototype.fetchRecords.name, () => {
    it('adjusts from and calls correctly', async () => {
      const ethereum = mock<EthereumClient>({
        getLogsUsingBisection: mockFn().returnsOnce([]),
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

      await eventUpdater.fetchRecords(
        START,
        START.add(1, 'hours'),
        DETAILS_EVENT_A,
      )

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
        getLogsUsingBisection: mockFn().returnsOnce([
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
        DETAILS_EVENT_A,
      )

      expect(result.map((r) => r.timestamp)).toEqual([
        START.add(2, 'hours'),
        START.add(3, 'hours'),
      ])
    })
  })

  describe(EventUpdater.prototype.eventBlockNumbers.name, () => {
    it('ask for a block number of a 1 hour earlier', async () => {
      const ethereum = mock<EthereumClient>({
        getLogsUsingBisection: mockFn().returnsOnce([]),
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
      await eventUpdater.eventBlockNumbers(
        START,
        START.add(1, 'hours'),
        DETAILS_EVENT_A,
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
        getLogsUsingBisection: mockFn().returnsOnce([
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

      const result = await eventUpdater.eventBlockNumbers(
        START,
        START.add(1, 'hours'),
        DETAILS_EVENT_A,
      )

      expect(result).toEqual([100n, 200n, 300n])
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
