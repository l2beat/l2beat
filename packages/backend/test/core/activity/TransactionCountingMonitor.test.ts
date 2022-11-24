import { Logger, mock, MockedObject } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'

import { TransactionCountingMonitor } from '../../../src/core/activity/TransactionCountingMonitor'
import { TransactionCounter } from '../../../src/core/activity/types'
import { Clock } from '../../../src/core/Clock'
import { SequenceProcessor } from '../../../src/core/SequenceProcessor'

const startOfToday = UnixTime.now().toStartOf('day')
const lastProcessedTimestampA = startOfToday.add(-1, 'days')
const idA = 'a'
const idB = 'b'

describe(TransactionCountingMonitor.name, () => {
  describe(TransactionCountingMonitor.prototype.checkIfSynced.name, () => {
    it('skips check if too early', async () => {
      const syncCheckDelayHours = 3
      const lastHour = UnixTime.now()
        .toStartOf('day')
        .add(syncCheckDelayHours - 1, 'hours')
      const clock = mockClock(lastHour)
      const logger = mockLogger()
      const monitor = new TransactionCountingMonitor([], clock, logger, {
        syncCheckDelayHours,
      })

      await monitor.checkIfSynced()

      expect(logger.error).toHaveBeenCalledExactlyWith([])
      expect(logger.info).toHaveBeenCalledExactlyWith([
        ['Skipping sync check - too early'],
      ])
    })

    it('does not log error if synced', async () => {
      const syncCheckDelayHours = 2
      const lastHour = startOfToday.add(syncCheckDelayHours, 'hours')
      const clock = mockClock(lastHour)
      const logger = mockLogger()
      const counters = [
        mockCounter({
          id: idA,
          hasProcessedAll: true,
          lastProcessedTimestamp: lastProcessedTimestampA,
        }),
        mockCounter({
          id: idB,
          hasProcessedAll: false,
          lastProcessedTimestamp: startOfToday,
        }),
      ]
      const monitor = new TransactionCountingMonitor(counters, clock, logger, {
        syncCheckDelayHours,
      })

      await monitor.checkIfSynced()

      expect(logger.error).toHaveBeenCalledExactlyWith([])
      expect(logger.info).toHaveBeenCalledExactlyWith([
        ['Sync check started'],
        [
          'Transaction counter sync check result',
          {
            syncInfos: [
              {
                hasProcessedAll: true,
                lastDayWithData: lastProcessedTimestampA.toYYYYMMDD(),
                projectId: idA,
                synced: true,
              },
              {
                hasProcessedAll: false,
                lastDayWithData: startOfToday.toYYYYMMDD(),
                projectId: idB,
                synced: true,
              },
            ],
            today: startOfToday.toYYYYMMDD(),
          },
        ],
        [
          'All transaction counters are synced',
          {
            today: startOfToday.toYYYYMMDD(),
          },
        ],
        ['Sync check finished'],
      ])
    })

    it('logs error if at least one not synced', async () => {
      const syncCheckDelayHours = 2
      const startOfToday = UnixTime.now().toStartOf('day')
      const lastHour = startOfToday.add(syncCheckDelayHours, 'hours')
      const clock = mockClock(lastHour)
      const logger = mockLogger()
      const counters = [
        mockCounter({
          id: idA,
          hasProcessedAll: false,
          lastProcessedTimestamp: lastProcessedTimestampA,
        }),
        mockCounter({
          id: idB,
          hasProcessedAll: false,
          lastProcessedTimestamp: startOfToday,
        }),
      ]
      const monitor = new TransactionCountingMonitor(counters, clock, logger, {
        syncCheckDelayHours,
      })

      await monitor.checkIfSynced()

      expect(logger.error).toHaveBeenCalledExactlyWith([
        [
          {
            syncInfo: {
              counters: [
                {
                  hasProcessedAll: false,
                  lastDayWithData: lastProcessedTimestampA.toYYYYMMDD(),
                  projectId: idA,
                  synced: false,
                },
                {
                  hasProcessedAll: false,
                  lastDayWithData: startOfToday.toYYYYMMDD(),
                  projectId: idB,
                  synced: true,
                },
              ],
              today: startOfToday.toYYYYMMDD(),
            },
          },
          new Error('Not all transaction counters are synced'),
        ],
      ])

      expect(logger.info).toHaveBeenCalledExactlyWith([
        ['Sync check started'],
        [
          'Transaction counter sync check result',
          {
            syncInfos: [
              {
                hasProcessedAll: false,
                lastDayWithData: lastProcessedTimestampA.toYYYYMMDD(),
                projectId: idA,
                synced: false,
              },
              {
                hasProcessedAll: false,
                lastDayWithData: startOfToday.toYYYYMMDD(),
                projectId: idB,
                synced: true,
              },
            ],
            today: startOfToday.toYYYYMMDD(),
          },
        ],
        ['Sync check finished'],
      ])
    })
  })
})

// Not ideal, because looses type information
// I could not make it work with mock<Logger> - it kept requiring specific overload type of `Logger.info`
function mockLogger(): Logger & {
  info: ReturnType<typeof mockFn>
  error: ReturnType<typeof mockFn>
} {
  const logger = Object.create(Logger.SILENT)
  logger.for = () => logger
  logger.info = mockFn(() => {})
  logger.error = mockFn(() => {})
  return logger
}

function mockClock(lastHour: UnixTime): MockedObject<Clock> {
  return mock<Clock>({ getLastHour: () => lastHour })
}

function mockCounter({
  id,
  hasProcessedAll,
  lastProcessedTimestamp,
}: {
  id: string
  hasProcessedAll: boolean
  lastProcessedTimestamp: UnixTime
}): MockedObject<TransactionCounter> {
  return mock<TransactionCounter>({
    processor: mock<SequenceProcessor>({
      id,
      hasProcessedAll: () => hasProcessedAll,
    }),
    getLastProcessedTimestamp: async () => lastProcessedTimestamp,
  })
}
