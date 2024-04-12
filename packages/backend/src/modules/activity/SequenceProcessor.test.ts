import { Logger, LoggerOptions } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockFn, MockFunction } from 'earl'
import { once } from 'events'

import { describeDatabase } from '../../test/database'
import { SequenceProcessorRepository } from './repositories/SequenceProcessorRepository'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from './SequenceProcessor'

describeDatabase(SequenceProcessor.name, (database) => {
  const repository = new SequenceProcessorRepository(database, Logger.SILENT)
  const PROCESSOR_ID = 'test'
  let sequenceProcessor: SequenceProcessor

  type ProcessRange = (from: number, to: number, trx: any) => Promise<void>

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
    getLatest: (current: number) => number
    processRange: ProcessRange
    refreshInterval?: number
    uncertaintyBuffer?: number
    reportError?: LoggerOptions['reportError']
  }) {
    const logger = new Logger({
      logLevel: 'ERROR', // tests rely on error being reported -- do not change
      format: 'pretty',
      reportError,
      backend: {
        // we do not want the logs to be printed during tests
        log: () => void 0,
        debug: () => void 0,
        warn: () => void 0,
        error: () => void 0,
      },
    })

    return new (class extends SequenceProcessor {
      constructor() {
        super(
          ProjectId(PROCESSOR_ID),
          repository,
          {
            batchSize,
            startFrom,
            uncertaintyBuffer,
            scheduleIntervalMs: refreshInterval,
          },
          logger,
        )
      }

      protected override async getLatest(current: number) {
        return Promise.resolve(getLatest(current))
      }

      protected override async processRange(
        from: number,
        to: number,
        trx: any,
      ): Promise<void> {
        return processRange(from, to, trx)
      }
    })()
  }

  beforeEach(async () => {
    await repository.deleteAll()
  })

  afterEach(async () => {
    await sequenceProcessor.stop()
  })

  describe('simple one off process', () => {
    it('processes in ranges', async () => {
      const getLatest = mockFn((_: number) => 5)
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)

      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatest).toHaveBeenCalledTimes(2)
      expect(getLatest).toHaveBeenNthCalledWith(1, 0)
      expect(getLatest).toHaveBeenNthCalledWith(2, 5)

      checkRanges(processRange, [
        [0, 1],
        [2, 3],
        [4, 5],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
        latest: 5,
        syncedOnce: true,
      })
    })

    it('respects `startFrom`', async () => {
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)

      sequenceProcessor = createSequenceProcessor({
        startFrom: 4,
        batchSize: 2,
        getLatest: () => 5,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      checkRanges(processRange, [[4, 5]])
      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
        latest: 5,
        syncedOnce: true,
      })
    })

    it('works with a single-element sequence', async () => {
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)

      sequenceProcessor = createSequenceProcessor({
        startFrom: 4,
        batchSize: 2,
        getLatest: () => 4,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      checkRanges(processRange, [[4, 4]])
      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 4,
        latest: 4,
        syncedOnce: true,
      })
    })

    it('works with batch size of 1', async () => {
      const getLatest = mockFn((_: number) => 2)
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)

      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatest).toHaveBeenCalledTimes(2)
      expect(getLatest).toHaveBeenNthCalledWith(1, 0)
      expect(getLatest).toHaveBeenNthCalledWith(2, 2)

      checkRanges(processRange, [
        [0, 0],
        [1, 1],
        [2, 2],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
        latest: 2,
        syncedOnce: true,
      })
    })

    it('works with huge batch sizes', async () => {
      const getLatest = mockFn((_: number) => 2)
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)

      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 100,
        getLatest,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatest).toHaveBeenCalledTimes(2)
      expect(getLatest).toHaveBeenNthCalledWith(1, 0)
      expect(getLatest).toHaveBeenNthCalledWith(2, 2)

      checkRanges(processRange, [[0, 2]])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
        latest: 2,
        syncedOnce: true,
      })
    })

    it('re-processes data when from > getLatest', async () => {
      const time = install()

      const reportError = mockFn().returns(undefined)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 2,
        batchSize: 1,
        getLatest: () => 0,
        processRange: mockFn().resolvesTo(undefined),
        reportError,
        // Because we use fake-timers, we need to disable the refresh interval
        refreshInterval: Infinity,
      })

      await sequenceProcessor.start()
      await waitForErrorReport(time, reportError)

      time.uninstall()
      sequenceProcessor._TEST_ONLY_stopQueue()

      expect(reportError.calls[0].args[0].error).toEqual(
        new Error(
          'Assertion Error: getLatest returned sequence member that was already processed. from=2, latest=0',
        ),
      )
      expect(reportError).toHaveBeenCalledTimes(1)
    })

    it('works when processRange throws', async () => {
      const time = install()

      const errorMessage = 'Force-failing during tests!'
      const reportError = mockFn().returns(undefined)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest: () => 5,
        processRange: mockFn().rejectsWith(new Error(errorMessage)),
        reportError,
        // Because we use fake-timers, we need to disable the refresh interval
        refreshInterval: Infinity,
      })

      await sequenceProcessor.start()
      await waitForErrorReport(time, reportError)

      time.uninstall()
      sequenceProcessor._TEST_ONLY_stopQueue()

      expect(reportError.calls[0].args[0].error).toEqual(
        new Error(errorMessage),
      )
      expect(reportError).toHaveBeenCalledTimes(1)
    })

    it('does not process anything when already done', async () => {
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)
      const latest = 5
      const initialState = {
        id: PROCESSOR_ID,
        lastProcessed: latest,
        latest,
        syncedOnce: true,
      }
      await repository.addOrUpdate(initialState)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 1,
        batchSize: 2,
        getLatest: () => latest,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(processRange).not.toHaveBeenCalled()
      expect(await repository.findById(PROCESSOR_ID)).toEqual(initialState)
    })

    it('continues syncing when more data available', async () => {
      const getLatest = mockFn((current) => (current === 0 ? 5 : 7))
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLatest,
        processRange,
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      // deep inspect getLatestMock. It should be called with 0, 5, and rest is 7s
      expect(getLatest).toHaveBeenNthCalledWith(1, 0)
      expect(getLatest).toHaveBeenNthCalledWith(2, 5)
      for (let i = 3; i <= getLatest.calls.length; i++) {
        expect(getLatest).toHaveBeenNthCalledWith(i, 7)
      }

      checkRanges(processRange, [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 7,
        latest: 7,
        syncedOnce: true,
      })
    })
  })

  describe('complex processing with refresh', () => {
    it('continues syncing during next schedule', async () => {
      let syncedOnce = false
      const getLatest = mockFn((_: number) => (syncedOnce ? 2 : 1))
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest,
        processRange,
        refreshInterval: 1, // kick refresh right after it's done
      })

      await sequenceProcessor.start()

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      syncedOnce = true

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatest).toHaveBeenCalledWith(0)
      expect(getLatest).toHaveBeenCalledWith(1)
      expect(getLatest).toHaveBeenCalledWith(2)

      checkRanges(processRange, [
        [0, 0],
        [1, 1],
        [2, 2],
      ])

      expect(await repository.findById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
        latest: 2,
        syncedOnce: true,
      })
    })

    it('continues syncing during next schedule and respects uncertainty buffer', async () => {
      let syncedOnce = false
      const getLatest = mockFn((_: number) => (syncedOnce ? 5 : 4))
      const processRange = mockFn<ProcessRange>().resolvesTo(undefined)
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest,
        processRange,
        refreshInterval: 1, // kick refresh right after it's done
        uncertaintyBuffer: 2,
      })

      await sequenceProcessor.start()

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      expect(getLatest).toHaveBeenCalledTimes(2)
      expect(getLatest).toHaveBeenNthCalledWith(1, 0)
      expect(getLatest).toHaveBeenNthCalledWith(2, 4)
      syncedOnce = true

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)

      expect(getLatest).toHaveBeenCalledWith(0)
      expect(getLatest).toHaveBeenCalledWith(4)
      expect(getLatest).toHaveBeenCalledWith(4)
      expect(getLatest).toHaveBeenCalledWith(5)

      checkRanges(processRange, [
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
        syncedOnce: true,
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
        syncedOnce: true,
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

  describe('syncedOnce flag', () => {
    it('sets syncedOnce to true after first full sync', async () => {
      const latest = 5
      await repository.addOrUpdate({
        id: PROCESSOR_ID,
        lastProcessed: 1,
        latest: latest,
        syncedOnce: false,
      })

      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLatest: mockFn(() => latest),
        processRange: mockFn(async () => {}),
      })

      await sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.getStatus()).toEqual({
        isProcessing: true,
        lastProcessed: 5,
        latest: 5,
        syncedOnce: true,
      })
    })
  })
})

function checkRanges(
  processRangeMock: MockFunction<[number, number, any], Promise<void>>,
  ranges: [number, number][],
) {
  expect(processRangeMock).toHaveBeenCalledTimes(ranges.length)
  for (const [i, [start, end]] of ranges.entries()) {
    expect(processRangeMock).toHaveBeenNthCalledWith(
      i + 1,
      start,
      end,
      expect.anything(),
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
    await time.tickAsync(100)
    errorReported = reportErrorMock.calls.length > currentCalls
  }
}
