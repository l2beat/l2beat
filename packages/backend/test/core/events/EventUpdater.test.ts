import { Logger, mock } from '@l2beat/common'
import { Layer2Event } from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BlockNumberUpdater } from '../../../src/core/BlockNumberUpdater'
import { Clock } from '../../../src/core/Clock'
import { EventUpdater } from '../../../src/core/events/EventUpdater'
import { Project } from '../../../src/model'
import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'

const START = UnixTime.fromDate(new Date('2022-08-09T00:00:00Z'))
const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

const EVENT: Layer2Event = {
  name: 'Event',
  abi: 'event Event()',
  emitter: EthereumAddress.random(),
  type: 'state',
  sinceTimestamp: START,
  untilTimestamp: undefined,
}

const eventDetails = (projectId: ProjectId) => {
  return {
    emitter: EVENT.emitter,
    name: EVENT.name,
    topic: '0x57050ab73f6b9ebdd9f76b8d4997793f48cf956e965ee070551b9ca0bb71584e',
    projectId,
    sinceTimestamp: EVENT.sinceTimestamp,
    untilTimestamp: EVENT.untilTimestamp,
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
    it('takes sinceTimestamp into consideration', async () => {
      const eventRepository = mock<EventRepository>({
        addMany: mockFn().returns([]),
        getDataBoundary: mockFn().returns(new Map([])),
      })

      const projects: Project[] = [
        {
          projectId: PROJECT_A,
          type: 'layer2',
          escrows: [],
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
        getAllLogs: mockFn()
          .returnsOnce([mockLog(120), mockLog(150), mockLog(250)])
          .returnsOnce([mockLog(350)]),
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

      const projects: Project[] = [
        {
          projectId: PROJECT_A,
          type: 'layer2',
          escrows: [],
          events: [EVENT],
        },
        {
          projectId: PROJECT_B,
          type: 'layer2',
          escrows: [],
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

      const records = [
        {
          timestamp: START.add(1, 'hours'),
          name: EVENT.name,
          projectId: PROJECT_A,
        },
        {
          timestamp: START.add(1, 'hours'),
          name: EVENT.name,
          projectId: PROJECT_A,
        },
        {
          timestamp: START.add(2, 'hours'),
          name: EVENT.name,
          projectId: PROJECT_A,
        },
        {
          timestamp: START.add(3, 'hours'),
          name: EVENT.name,
          projectId: PROJECT_B,
        },
      ]

      expect(eventRepository.addMany).toHaveBeenCalledExactlyWith([[records]])
    })
  })
})
