import { Logger } from '@l2beat/backend-tools'
import type { EventTracker } from '@l2beat/shared'
import { Retries } from '@l2beat/shared-pure'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TaskQueue } from './TaskQueue'

describe(TaskQueue.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes all jobs', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await wait(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, { metricsId: 'test' })

    for (let i = 0; i < 10; i++) {
      queue.addToBack(i)
    }

    await vi.runAllTimersAsync()

    expect(completed).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('can handle occasional failure', async () => {
    const completed: number[] = []
    let failures = 10

    async function execute(i: number) {
      await wait(1)
      if (failures > 0) {
        failures--
        throw new Error('oops')
      }
      completed.push(i)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, {
      shouldRetry: Retries.always(),
      metricsId: 'test',
    })

    for (let i = 0; i < 10; i++) {
      queue.addToBack(i)
    }

    await vi.runAllTimersAsync()

    expect(completed).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('can stop on permanent failure', async () => {
    const eventTracker = {
      record: vi.fn().mockReturnValue(undefined),
    } as unknown as EventTracker<string>

    const completed: number[] = []

    async function execute(i: number) {
      await wait(1)
      if (i === 1) {
        throw new Error('oops')
      }

      completed.push(i)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, {
      shouldRetry: Retries.maxAttempts(1),
      metricsId: 'test',
      eventTracker,
    })

    for (let i = 0; i < 3; i++) {
      queue.addToBack(i)
    }

    await vi.runAllTimersAsync()

    expect(queue.isStopped()).toStrictEqual(true)
    expect(completed).toStrictEqual([0]) // everything after task '1' was dropped
    expect(eventTracker.record).toHaveBeenCalledWith('error')
  })

  it('notifies after configured threshold is reached', async () => {
    const eventTracker = {
      record: vi.fn().mockReturnValue(undefined),
    } as unknown as EventTracker<string>

    const error = new Error('oops')

    async function execute() {
      throw error
    }

    const logger = {
      error: vi.fn(() => undefined),
      warn: vi.fn(() => undefined),
      debug: vi.fn(() => undefined),
      info: vi.fn(() => undefined),
    } as unknown as Logger

    const queue = new TaskQueue(execute, logger, {
      shouldRetry: Retries.exponentialBackOff({
        stepMs: 1,
        maxDistanceMs: Number.POSITIVE_INFINITY,
        maxAttempts: 5,
        notifyAfterAttempts: 2,
      }),
      metricsId: 'test',
      eventTracker,
    })
    queue.addToBack(0)

    await vi.runAllTimersAsync()

    // max attempts = 5
    // notify after attempts = 2
    // 1st attempt: retry
    // 2nd attempt: retry
    // 3rd attempt: retry + notify
    // 4th attempt: retry + notify
    // 5th attempt: stop queue

    // 3 notifications + 1 error when stopping queue
    expect(logger.error).toHaveBeenCalledTimes(3)
    expect(logger.error).toHaveBeenNthCalledWith(1, error, {
      job: expect.any(Object),
    })
    expect(logger.error).toHaveBeenNthCalledWith(2, error, {
      job: expect.any(Object),
    })
    expect(logger.error).toHaveBeenNthCalledWith(
      3,
      'Stopping queue because of error',
      {
        job: expect.any(Object),
        error,
      },
    )
    expect(eventTracker.record).toHaveBeenCalledWith('error')
  })

  it('can add jobs to front', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await wait(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, { metricsId: 'test' })

    for (let i = 0; i < 10; i++) {
      queue.addToFront(i)
    }

    await vi.runAllTimersAsync()

    expect(completed).toStrictEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  })

  it('can add jobs only if empty', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await wait(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, { metricsId: 'test' })

    for (let i = 0; i < 10; i++) {
      queue.addIfEmpty(i)
    }
    queue.addToBack(420)

    await vi.runAllTimersAsync()

    expect(completed).toStrictEqual([0, 420])
  })

  it('can accept only positive integers for workers', async () => {
    expect(() => {
      new TaskQueue(Promise.resolve, Logger.SILENT, {
        workers: 1.5,
        metricsId: 'test',
      })
    }).toThrow('workers needs to be a positive integer')
    expect(() => {
      new TaskQueue(Promise.resolve, Logger.SILENT, {
        workers: -1,
        metricsId: 'test',
      })
    }).toThrow('workers needs to be a positive integer')
  })

  it('can execute tasks asynchronously', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await wait(value)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, {
      workers: 3,
      metricsId: 'test',
    })

    queue.addToBack(1)
    queue.addToBack(3)
    queue.addToBack(5)
    queue.addToBack(1)
    queue.addToBack(2)

    await vi.runAllTimersAsync()

    expect(completed).toStrictEqual([1, 1, 3, 2, 5])
  })

  it('can wait until it is empty', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await wait(value * 10)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT, {
      workers: 3,
      metricsId: 'test',
    })

    queue.addToBack(1)
    queue.addToBack(3)
    queue.addToBack(5)
    queue.addToBack(1)
    queue.addToBack(2)

    await vi.runAllTimersAsync()

    await queue.waitTillEmpty()

    expect(queue.length).toStrictEqual(0)
  })
})

// Unfortunately fake timers do not work well with timers/promises
const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))
