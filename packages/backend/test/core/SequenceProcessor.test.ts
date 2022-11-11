import { Logger } from '@l2beat/common'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import {
  SequenceProcessor,
  SequenceProcessorOpts,
} from '../../src/core/SequenceProcessor'
import { SequenceProcessorRepository } from '../../src/peripherals/database/SequenceProcessorRepository'
import { setupDatabaseTestSuite } from '../peripherals/database/shared/setup'

describe(SequenceProcessor.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new SequenceProcessorRepository(database, Logger.SILENT)
  const PROCESSOR_ID = 'test'

  function createSequenceProcessor({
    getLast,
    processRange,
    startFrom,
    batchSize,
    refreshInterval,
  }: {
    startFrom: number
    batchSize: number
    getLast: SequenceProcessorOpts['getLast']
    processRange: SequenceProcessorOpts['processRange']
    refreshInterval?: number
  }) {
    return new SequenceProcessor({
      id: PROCESSOR_ID,
      logger: Logger.SILENT,
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

  it('processes in ranges', async () => {
    const getLastMock = mockFn<SequenceProcessorOpts['getLast']>().resolvesTo(5)
    const processRangeMock =
      mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
    const sequenceProcessor = createSequenceProcessor({
      startFrom: 0,
      batchSize: 2,
      getLast: getLastMock,
      processRange: processRangeMock,
    })

    sequenceProcessor.start()

    await waitForExpect(async () => {
      expect(await sequenceProcessor.isLastReached()).toEqual(true)
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
  })

  it('respects start from', async () => {
    const processRangeMock =
      mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
    const sequenceProcessor = createSequenceProcessor({
      startFrom: 4,
      batchSize: 2,
      async getLast() {
        return 5
      },
      processRange: processRangeMock,
    })

    sequenceProcessor.start()

    await waitForExpect(async () => {
      expect(await sequenceProcessor.isLastReached()).toEqual(true)
      expect(processRangeMock).toHaveBeenCalledExactlyWith([
        [4, 5, expect.anything()],
      ])
      expect(await repository.getById(PROCESSOR_ID)).toEqual({
        id: PROCESSOR_ID,
        tip: 5,
      })
    })
  })

  it('doesnt process anything when already done', async () => {
    const processRangeMock =
      mockFn<SequenceProcessorOpts['processRange']>().resolvesTo()
    const sequenceProcessor = createSequenceProcessor({
      startFrom: 5,
      batchSize: 2,
      async getLast() {
        return 5
      },
      processRange: processRangeMock,
    })

    sequenceProcessor.start()

    await waitForExpect(async () => {
      expect(await sequenceProcessor.isLastReached()).toEqual(true)
      expect(processRangeMock).toHaveBeenCalledExactlyWith([])
      // note: we are fine with no entry in repository in this case
    })
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
    const sequenceProcessor = createSequenceProcessor({
      startFrom: 0,
      batchSize: 2,
      getLast: getLastMock,
      processRange: processRangeMock,
    })

    sequenceProcessor.start()

    await waitForExpect(async () => {
      expect(await sequenceProcessor.isLastReached()).toEqual(true)
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

  // write this test using emitted event
  it('continues syncing during next schedule')

  it('emits event when sync done')

  it('throws when start from > getLast')

  it('works when processRange throws')
})
