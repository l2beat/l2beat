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
    getLast,
    processRange,
    startFrom,
    batchSize,
    refreshInterval,
    reportError,
  }: {
    startFrom: number
    batchSize: number
    getLast: SequenceProcessorOpts['getLast']
    processRange: SequenceProcessorOpts['processRange']
    refreshInterval?: number
    reportError?: LoggerOptions['reportError']
  }) {
    return new SequenceProcessor({
      id: PROCESSOR_ID,
      logger: new Logger({
        logLevel: LogLevel.ERROR, // tests rely on error being logged -- do not change
        format: 'pretty',
        reportError,
      }),
      repository,
      startFrom,
      batchSize,
      getLast,
      processRange,
      scheduleIntervalMs: refreshInterval,
    })
  }

  beforeEach(async () => {
    await repository.deleteAll()
  })

  afterEach(async () => {
    await sequenceProcessor.stop()
  })

  describe('simple one off process', () => {
    it('processes in ranges', async () => {
      const getLastMock =
        mockFn<SequenceProcessorOpts['getLast']>().resolvesTo(5)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLast: getLastMock,
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      expect(getLastMock).toHaveBeenCalledExactlyWith([[0], [5]])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 1, expect.anything()],
        [2, 3, expect.anything()],
        [4, 5, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 5,
      })
    })

    it('respects `startFrom`', async () => {
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 4,
        batchSize: 2,
        async getLast() {
          return 5
        },
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [4, 5, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 5,
      })
    })

    it('works with batch size of 1', async () => {
      const getLastMock =
        mockFn<SequenceProcessorOpts['getLast']>().resolvesTo(2)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLast: getLastMock,
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      expect(getLastMock).toHaveBeenCalledExactlyWith([[0], [2]])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 0, expect.anything()],
        [1, 1, expect.anything()],
        [2, 2, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 2,
      })
    })

    it('works with huge batch sizes', async () => {
      const getLastMock =
        mockFn<SequenceProcessorOpts['getLast']>().resolvesTo(2)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 100,
        getLast: getLastMock,
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      expect(getLastMock).toHaveBeenCalledExactlyWith([[0], [2]])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 2, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 2,
      })
    })

    it('re-processes data when from > getLast', async () => {
      const time = install()

      const errorMessage =
        'getLast returned sequence member that was already processed'
      const reportErrorMock = mockFn().returns(undefined)
      const getLastMock =
        mockFn<SequenceProcessorOpts['getLast']>().resolvesTo(0)
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 2,
        batchSize: 1,
        getLast: getLastMock,
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

      // we let queue refresh once more to stop it
      expect(reportErrorMock).toHaveBeenCalledExactlyWith([
        expect.arrayWith(
          expect.objectWith({ message: expect.stringMatching(errorMessage) }),
        ),
        expect.arrayWith(
          expect.objectWith({ message: expect.stringMatching(errorMessage) }),
        ),
      ])
    })

    it('works when processRange throws', async () => {
      const time = install()

      const errorMessage = 'Force-failing during tests!'
      const reportErrorMock = mockFn().returns(undefined)
      const getLastMock =
        mockFn<SequenceProcessorOpts['getLast']>().resolvesTo(5)
      const processRangeMock = mockFn<
        SequenceProcessorOpts['processRange']
      >().rejectsWith(new Error(errorMessage))
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLast: getLastMock,
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

      // we let queue refresh once more to stop it
      expect(reportErrorMock).toHaveBeenCalledExactlyWith([
        expect.arrayWith(expect.objectWith({ message: errorMessage })),
        expect.arrayWith(expect.objectWith({ message: errorMessage })),
      ])
    })

    it('doesnt process anything when already done', async () => {
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 5,
        batchSize: 2,
        async getLast() {
          return 5
        },
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      expect(processRangeMock).toHaveBeenCalledExactlyWith([])
      // note: we are fine with no entry in repository in this case
    })

    it('continues syncing when more data available', async () => {
      const getLastMock = mockFn<SequenceProcessorOpts['getLast']>().executes(
        async (last: any) => {
          if (last === 0) {
            return 5
          }
          return 7
        },
      )
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 2,
        getLast: getLastMock,
        processRange: processRangeMock,
      })

      sequenceProcessor.start()
      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      // deep inspect getLastMock. It should be called with [0], [5], and rest is [7]s
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(getLastMock).toHaveBeenCalledExactlyWith([
        [0],
        [5],
        ...new Array(getLastMock.calls.length - 2).fill([7]),
      ])
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 1, expect.anything()],
        [2, 3, expect.anything()],
        [4, 5, expect.anything()],
        [6, 7, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 7,
      })
    })
  })

  describe('complex processing with refresh', () => {
    it('continues syncing during next schedule', async () => {
      let syncedOnce = false
      const getLastMock = mockFn<SequenceProcessorOpts['getLast']>().executes(
        async () => {
          if (!syncedOnce) {
            return 1
          }
          return 2
        },
      )
      const processRangeMock =
        mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
      sequenceProcessor = createSequenceProcessor({
        startFrom: 0,
        batchSize: 1,
        getLast: getLastMock,
        processRange: processRangeMock,
        refreshInterval: 1, // kick refresh right after it's done
      })

      sequenceProcessor.start()

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)
      syncedOnce = true

      await once(sequenceProcessor, ALL_PROCESSED_EVENT)

      expect(sequenceProcessor.isLastReached()).toEqual(true)
      // deep inspect getLastMock. It should be called with [0], [5], and rest is [7]s
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(getLastMock).toHaveBeenCalledExactlyWith(
        expect.arrayWith([0], [1], [2]),
      )
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [0, 0, expect.anything()],
        [1, 1, expect.anything()],
        [2, 2, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 2,
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
