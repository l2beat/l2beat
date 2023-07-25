import { Logger, LoggerOptions, LogLevel } from '@l2beat/shared'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockFn, MockFunction } from 'earl'
import { once } from 'events'

import { SequenceProcessorRepository } from '../peripherals/database/SequenceProcessorRepository'
import { setupDatabaseTestSuite } from '../test/database'
import {
  ALL_PROCESSED_EVENT,
  SequenceProcessor,
  SequenceProcessorOpts,
} from './SequenceProcessor'

describe(SequenceProcessor.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new SequenceProcessorRepository(database, Logger.SILENT)
  const PROCESSOR_ID = 'test'
  let sequenceProcessor: SequenceProcessor

  function createSequenceProcessor({
    getLatest,
    processRange,
    startFrom,
    batchSize,
    refreshInterval,
    reportError,
    uncertaintyBuffer,
  }: {
    startFrom: number
    batchSize: number
    getLatest: SequenceProcessorOpts['getLatest']
    processRange: SequenceProcessorOpts['processRange']
    refreshInterval?: number
    uncertaintyBuffer?: number
    reportError?: LoggerOptions['reportError']
  }) {
    return new SequenceProcessor(
      PROCESSOR_ID,
      new Logger({
        logLevel: LogLevel.ERROR, // tests rely on error being logged -- do not change
        format: 'pretty',
        reportError,
      }),
      repository,
      {
        startFrom,
        batchSize,
        getLatest,
        processRange,
        scheduleIntervalMs: refreshInterval,
        uncertaintyBuffer,
      },
    )
  }

  beforeEach(async () => {
    await repository.deleteAll()
  })

  afterEach(async () => {
    await sequenceProcessor.stop()
  })

  describe('simple one off process', () => {
    it('processes in ranges', async () => {
      const getLatestMock =
        mockFn<SequenceProcessorOpts['getLatest']>().resolvesTo(5)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest: getLatestMock,
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatestMock).toHaveBeenCalledTimes(2)
      expect(getLatestMock).toHaveBeenNthCalledWith(1, 0)
      expect(getLatestMock).toHaveBeenNthCalledWith(2, 5)

      checkRanges(processRangeMock, [
        [0, 1],
        [2, 3],
        [4, 5],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
        latest: 5,
      })
    })

    it('respects `startFrom`', async () => {
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 4,
        batchSize: 2,
        async getLatest() {
          return 5
        },
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      checkRanges(processRangeMock, [[4, 5]])
      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
        latest: 5,
      })
    })

    it('works with a single-element sequence', async () => {
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 4,
        batchSize: 2,
        async getLatest() {
          return 4
        },
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      checkRanges(processRangeMock, [[4, 4]])
      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 4,
        latest: 4,
      })
    })

    it('works with batch size of 1', async () => {
      const getLatestMock =
        mockFn<SequenceProcessorOpts['getLatest']>().resolvesTo(2)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest: getLatestMock,
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatestMock).toHaveBeenCalledTimes(2)
      expect(getLatestMock).toHaveBeenNthCalledWith(1, 0)
      expect(getLatestMock).toHaveBeenNthCalledWith(2, 2)

      checkRanges(processRangeMock, [
        [0, 0],
        [1, 1],
        [2, 2],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
        latest: 2,
      })
    })

    it('works with huge batch sizes', async () => {
      const getLatestMock =
        mockFn<SequenceProcessorOpts['getLatest']>().resolvesTo(2)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 100,
        getLatest: getLatestMock,
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatestMock).toHaveBeenCalledTimes(2)
      expect(getLatestMock).toHaveBeenNthCalledWith(1, 0)
      expect(getLatestMock).toHaveBeenNthCalledWith(2, 2)

      checkRanges(processRangeMock, [[0, 2]])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
        latest: 2,
      })
    })

    it('re-processes data when from > getLatest', async () => {
      const time = install()

      const reportErrorMock = mockFn().returns(undefined)
      const getLatestMock =
        mockFn<SequenceProcessorOpts['getLatest']>().resolvesTo(0)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 2,
        batchSize: 1,
        getLatest: getLatestMock,
        processRange: processRangeMock,
        reportError: reportErrorMock,
        // Because we use fake-timers, we need to disable the refresh interval
        refreshInterval: Infinity,
      })

      await sequenceProcessor.start()
      await waitForErrorReport(time, reportErrorMock)

      time.uninstall()

      expect(reportErrorMock).toHaveBeenOnlyCalledWith(expect.a(Error))
    })

    it('works when processRange throws', async () => {
      const time = install()

      const errorMessage = 'Force-failing during tests!'
      const reportErrorMock = mockFn().returns(undefined)
      const getLatestMock =
        mockFn<SequenceProcessorOpts['getLatest']>().resolvesTo(5)
      const processRangeMock = mockFn<
        SequenceProcessorOpts['processRange']
      >().rejectsWith(new Error(errorMessage))
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest: getLatestMock,
        processRange: processRangeMock,
        reportError: reportErrorMock,
        // Because we use fake-timers, we need to disable the refresh interval
        refreshInterval: Infinity,
      })

      await sequenceProcessor.start()
      await waitForErrorReport(time, reportErrorMock)

      time.uninstall()

      expect(reportErrorMock).toHaveBeenOnlyCalledWith(expect.a(Error))
    })

    it('does not process anything when already done', async () => {
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      const latest = 5
      const initialState = {
        id: PROCESSOR_ID,
        lastProcessed: latest,
        latest,
      }
      await repository.addOrUpdate(initialState)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 1,
        batchSize: 2,
        async getLatest() {
          return latest
        },
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(processRangeMock).not.toHaveBeenCalled()
      expect(await repository.findById(PROCESSOR_ID)).toEqual(initialState)
    })

    it('continues syncing when more data available', async () => {
      const getLatestMock = mockFn<
        SequenceProcessorOpts['getLatest']
      >().executes(async (latest: any) => {
        if (latest === 0) {
          return 5
        }
        return 7
      })
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest: getLatestMock,
        processRange: processRangeMock,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      // deep inspect getLatestMock. It should be called with 0, 5, and rest is 7s
      expect(getLatestMock).toHaveBeenNthCalledWith(1, 0)
      expect(getLatestMock).toHaveBeenNthCalledWith(2, 5)
      for (let i = 3; i <= getLatestMock.calls.length; i++) {
        expect(getLatestMock).toHaveBeenNthCalledWith(i, 7)
      }

      checkRanges(processRangeMock, [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 7,
        latest: 7,
      })
    })
  })

  describe('complex processing with refresh', () => {
    it('continues syncing during next schedule', async () => {
      let syncedOnce = false
      const getLatestMock = mockFn<
        SequenceProcessorOpts['getLatest']
      >().executes(async () => {
        if (!syncedOnce) {
          return 1
        }
        return 2
      })
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest: getLatestMock,
        processRange: processRangeMock,
        refreshInterval: 1, // kick refresh right after it's done
      })

      await sequenceProcessor.start()

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      syncedOnce = true

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatestMock).toHaveBeenCalledWith(0)
      expect(getLatestMock).toHaveBeenCalledWith(1)
      expect(getLatestMock).toHaveBeenCalledWith(2)

      checkRanges(processRangeMock, [
        [0, 0],
        [1, 1],
        [2, 2],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
        latest: 2,
      })
    })

    it('continues syncing during next schedule and respects uncertainty buffer', async () => {
      let syncedOnce = false
      const getLatestMock = mockFn<
        SequenceProcessorOpts['getLatest']
      >().executes(async () => {
        if (!syncedOnce) {
          return 4
        }
        return 5
      })
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest: getLatestMock,
        processRange: processRangeMock,
        refreshInterval: 1, // kick refresh right after it's done
        uncertaintyBuffer: 2,
      })

      await sequenceProcessor.start()

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      expect(getLatestMock).toHaveBeenCalledTimes(2)
      expect(getLatestMock).toHaveBeenNthCalledWith(1, 0)
      expect(getLatestMock).toHaveBeenNthCalledWith(2, 4)
      syncedOnce = true

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatestMock).toHaveBeenCalledWith(0)
      expect(getLatestMock).toHaveBeenCalledWith(4)
      expect(getLatestMock).toHaveBeenCalledWith(4)
      expect(getLatestMock).toHaveBeenCalledWith(5)

      checkRanges(processRangeMock, [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [3, 3],
        [4, 4],
        [5, 5],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
        latest: 5,
      })
    })
  })

  describe('state management', () => {
    it('loads empty state on start', async () => {
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest: mockFn(() => 1),
        processRange: mockFn(async () => {}),
      })

      await sequenceProcessor.start()

      expect(sequenceProcessor.hasProcessedAll()).toEqual(false)
    })

    it('loads existing state on start', async () => {
      const latest = 3
      await repository.addOrUpdate({
        id: PROCESSOR_ID,
        lastProcessed: latest,
        latest: latest,
      })
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest: mockFn(() => latest),
        processRange: mockFn(async () => {}),
      })

      await sequenceProcessor.start()

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
    })
  })
})

function checkRanges(
  processRangeMock: MockFunction<[number, number, any, Logger], Promise<void>>,
  ranges: [number, number][],
) {
  expect(processRangeMock).toHaveBeenCalledTimes(ranges.length)
  for (const [i, [start, end]] of ranges.entries()) {
    expect(processRangeMock).toHaveBeenNthCalledWith(
      i + 1,
      start,
      end,
      expect.anything(),
      expect.a(Logger),
    )
  }
}

async function waitForErrorReport(
  time: InstalledClock,
  reportErrorMock: MockFunction<any, any>,
) {
  const currentCalls = reportErrorMock.calls.length
  let errorReported = false

  while (!errorReported) {
    await time.tickAsync(1)
    errorReported = reportErrorMock.calls.length > currentCalls
  }
}
