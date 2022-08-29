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
const PROJECT_B = ProjectId('project-b')

const EVENT: ProjectEvent = {
  name: 'Event',
  abi: 'event Event()',
  emitter: EthereumAddress.random(),
  type: 'state',
  sinceTimestamp: START,
}

const eventDetails = (projectId: ProjectId) => {
  return {
    emitter: EVENT.emitter,
    name: EVENT.name,
    topic: '0x57050ab73f6b9ebdd9f76b8d4997793f48cf956e965ee070551b9ca0bb71584e',
    projectId,
    sinceTimestamp: EVENT.sinceTimestamp,
  }
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
    it('correctly offsets firstHour', async () => {
      const eventRepository = mock<EventRepository>({
        addMany: mockFn().returns([]),
        getDataBoundary: mockFn().returns(new Map([])),
      })

      const eventBeforeFirstHour = {
        ...EVENT,
        sinceTimestamp: new UnixTime(0),
      }

      const projects: ProjectInfo[] = [
        {
          name: PROJECT_A.toString(),
          projectId: PROJECT_A,
          bridges: [],
          events: [eventBeforeFirstHour],
        },
      ]

      const clock = mock<Clock>({
        getFirstHour: mockFn().returns(START.add(-7, 'days')),
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
        [
          START.add(-6, 'days'),
          START.add(2, 'hours'),
          { ...eventDetails(PROJECT_A), sinceTimestamp: new UnixTime(0) },
        ],
      ])
    })

    it('takes sinceTimestamp into consideration', async () => {
      const eventRepository = mock<EventRepository>({
        addMany: mockFn().returns([]),
        getDataBoundary: mockFn().returns(new Map([])),
      })

      const projects: ProjectInfo[] = [
        {
          name: PROJECT_A.toString(),
          projectId: PROJECT_A,
          bridges: [],
          events: [EVENT],
        },
      ]

      const clock = mock<Clock>({
        getFirstHour: mockFn().returns(START.add(-7, 'days')),
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
        [EVENT.sinceTimestamp, START.add(2, 'hours'), eventDetails(PROJECT_A)],
      ])
    })

    it('saves to db', async () => {
      const ethereumClient = mock<EthereumClient>({
        getLogsUsingBisection: mockFn().returns([
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
          events: [EVENT],
        },
        {
          name: PROJECT_B.toString(),
          projectId: PROJECT_B,
          bridges: [],
          events: [EVENT],
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
        eventDetails(PROJECT_A),
        [50n, 150n, 250n],
        [
          { timestamp: START.add(1, 'hours'), blockNumber: 100n },
          { timestamp: START.add(2, 'hours'), blockNumber: 200n },
          { timestamp: START.add(3, 'hours'), blockNumber: 300n },
        ],
      )
      expect(eventRepository.addMany).toHaveBeenCalledExactlyWith([
        [records.concat(records.map((r) => ({ ...r, projectId: PROJECT_B })))],
      ])
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
          events: [EVENT],
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
        [START, START.add(2, 'hours'), eventDetails(PROJECT_A)],
        [START.add(3, 'hours'), START.add(3, 'hours'), eventDetails(PROJECT_A)],
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
        eventDetails(PROJECT_A),
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
        eventDetails(PROJECT_A),
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
        eventDetails(PROJECT_A),
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
        eventDetails(PROJECT_A),
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
