import { Logger, LoggerOptions, LogLevel } from '@l2beat/common'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, Mock, mockFn } from 'earljs'
import { once } from 'events'

import {
  ALL_PROCESSED_EVENT,
  SequenceProcessor,
  SequenceProcessorOpts,
} from '../../src/core/SequenceProcessor'
import { SequenceProcessorRepository } from '../../src/peripherals/database/SequenceProcessorRepository'
import { setupDatabaseTestSuite } from '../peripherals/database/shared/setup'

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
  }: {
    startFrom: number
    batchSize: number
    getLatest: SequenceProcessorOpts['getLatest']
    processRange: SequenceProcessorOpts['processRange']
    refreshInterval?: number
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

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(getLatestMock).toHaveBeenCalledExactlyWith([[0], [5]])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 1, expect.anything()],
        [2, 3, expect.anything()],
        [4, 5, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
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

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [4, 5, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 5,
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

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(getLatestMock).toHaveBeenCalledExactlyWith([[0], [2]])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 0, expect.anything()],
        [1, 1, expect.anything()],
        [2, 2, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
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

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(getLatestMock).toHaveBeenCalledExactlyWith([[0], [2]])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 2, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
      })
    })

    it('re-processes data when from > getLatest', async () => {
      const time = install()

      const errorMessage =
        'getLatest returned sequence member that was already processed'
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
      })

      sequenceProcessor.start()
      await waitForErrorReport(time, reportErrorMock)

      await Promise.all([
        sequenceProcessor.stop(),
        waitForErrorReport(time, reportErrorMock),
      ])
      time.uninstall()

      expect(reportErrorMock).toHaveBeenCalledWith(
        expect.arrayWith(
          expect.objectWith({ message: expect.stringMatching(errorMessage) }),
        ),
      )
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
      })

      sequenceProcessor.start()
      await waitForErrorReport(time, reportErrorMock)

      await Promise.all([
        sequenceProcessor.stop(),
        waitForErrorReport(time, reportErrorMock),
      ])
      time.uninstall()

      expect(reportErrorMock).toHaveBeenCalledWith(
        expect.arrayWith(expect.objectWith({ message: errorMessage })),
      )
    })

    it('does not process anything when already done', async () => {
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 5,
        batchSize: 2,
        async getLatest() {
          return 5
        },
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      expect(processRangeMock).toHaveBeenCalledExactlyWith([])
      // note: we are fine with no entry in repository in this case
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

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      // deep inspect getLatestMock. It should be called with [0], [5], and rest is [7]s
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(getLatestMock).toHaveBeenCalledExactlyWith([
        [0],
        [5],
        ...new Array(getLatestMock.calls.length - 2).fill([7]),
      ])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 1, expect.anything()],
        [2, 3, expect.anything()],
        [4, 5, expect.anything()],
        [6, 7, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 7,
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

      sequenceProcessor.start()

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      syncedOnce = true

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.hasProcessedAll()).toEqual(true)
      // deep inspect getLatestMock. It should be called with [0], [5], and rest is [7]s
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(getLatestMock).toHaveBeenCalledExactlyWith(
        expect.arrayWith([0], [1], [2]),
      )
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 0, expect.anything()],
        [1, 1, expect.anything()],
        [2, 2, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        lastProcessed: 2,
      })
    })
  })
})

async function waitForErrorReport(
  time: InstalledClock,
  reportErrorMock: Mock<any, any>,
) {
  const currentCalls = reportErrorMock.calls.length
  let errorReported = false

  while (!errorReported) {
    await time.runToLastAsync()
    errorReported = reportErrorMock.calls.length > currentCalls
  }
}
