import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { createWorkerPool } from './createWorkers'

// Helper function since fake-timers don't work well with timers/promises
const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

describe('createWorkerPool', () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  describe('basic execution', () => {
    it('executes all tasks successfully', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const tasks = [
        async () => 'result1',
        async () => 'result2',
        async () => 'result3',
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results).toEqual(['result1', 'result2', 'result3'])
      expect(errors).toEqual([undefined, undefined, undefined])
      expect(timedOut).toEqual(false)
    })

    it('handles empty task array', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const resultPromise = workerPool.runInPool([])
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results).toEqual([])
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })

    it('executes tasks with correct concurrency', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const executionOrder: number[] = []
      const tasks = Array.from({ length: 5 }, (_, i) => async () => {
        executionOrder.push(i)
        await wait(50)
        return i
      })

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      await resultPromise

      // First 2 tasks should start immediately (worker count = 2)
      expect(executionOrder.slice(0, 2)).toEqual([0, 1])
    })
  })

  describe('error handling', () => {
    it('captures errors without stopping other tasks', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const tasks = [
        async () => 'success1',
        async () => {
          throw new Error('Task failed')
        },
        async () => 'success2',
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual('success1')
      expect(results[1]).toEqual(undefined)
      expect(results[2]).toEqual('success2')
      expect(errors[0]).toEqual(undefined)
      expect(errors[1]).toBeA(Error)
      expect(errors[1]?.message).toEqual('Task failed')
      expect(errors[2]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })

    it('handles non-Error throws', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const tasks = [
        async () => {
          throw 'string error'
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual(undefined)
      expect(errors[0]).toBeA(Error)
      expect(errors[0]?.message).toEqual('string error')
      expect(timedOut).toEqual(false)
    })
  })

  describe('per-task timeout', () => {
    it('times out individual slow tasks', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 100,
        timeoutPerRunMs: 5000,
      })

      const tasks = [
        async () => 'fast',
        async () => {
          await wait(200)
          return 'slow'
        },
        async () => 'fast2',
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual('fast')
      expect(results[1]).toEqual(undefined)
      expect(results[2]).toEqual('fast2')
      expect(errors[0]).toEqual(undefined)
      expect(errors[1]).toBeA(Error)
      expect(errors[1]?.message).toEqual('Task timeout')
      expect(errors[2]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })

    it('does not timeout tasks that finish just in time', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 150,
        timeoutPerRunMs: 5000,
      })

      const tasks = [
        async () => {
          await wait(100)
          return 'just-in-time'
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual('just-in-time')
      expect(errors[0]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })
  })

  describe('total run timeout', () => {
    it('stops processing when run timeout is reached', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 200,
      })

      const tasks = Array.from({ length: 10 }, (_, i) => async () => {
        await wait(100)
        return `result${i}`
      })

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, timedOut } = await resultPromise

      expect(timedOut).toEqual(true)
      // Not all tasks should complete
      const completedCount = results.filter((r) => r !== undefined).length
      expect(completedCount).toBeLessThan(10)
    })

    it('completes all tasks if run finishes before timeout', async () => {
      const workerPool = createWorkerPool({
        count: 3,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 1000,
      })

      const tasks = Array.from({ length: 5 }, (_, i) => async () => {
        await wait(50)
        return `result${i}`
      })

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, timedOut } = await resultPromise

      expect(timedOut).toEqual(false)
      expect(results).toEqual([
        'result0',
        'result1',
        'result2',
        'result3',
        'result4',
      ])
    })
  })

  describe('worker pool behavior', () => {
    it('processes tasks in order with single worker', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const executionOrder: number[] = []
      const tasks = [0, 1, 2, 3, 4].map((i) => async () => {
        executionOrder.push(i)
        await wait(10)
        return i
      })

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      await resultPromise

      expect(executionOrder).toEqual([0, 1, 2, 3, 4])
    })

    it('processes tasks concurrently with multiple workers', async () => {
      const workerPool = createWorkerPool({
        count: 3,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const startTimes: number[] = []
      const tasks = Array.from({ length: 6 }, () => async () => {
        startTimes.push(Date.now())
        await wait(100)
      })

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      await resultPromise

      // First 3 tasks should start at roughly the same time
      // Tasks 0, 1, 2 should start together
      const firstBatch = startTimes.slice(0, 3)
      const maxDiff = Math.max(...firstBatch) - Math.min(...firstBatch)
      expect(maxDiff).toBeLessThan(10) // Should be nearly simultaneous
    })

    it('respects worker count limit', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      let concurrentCount = 0
      let maxConcurrent = 0

      const tasks = Array.from({ length: 5 }, () => async () => {
        concurrentCount++
        maxConcurrent = Math.max(maxConcurrent, concurrentCount)
        await wait(50)
        concurrentCount--
      })

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      await resultPromise

      expect(maxConcurrent).toEqual(2)
    })
  })

  describe('edge cases', () => {
    it('handles tasks that return undefined', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const tasks = [async () => undefined, async () => 'value']

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual(undefined)
      expect(results[1]).toEqual('value')
      expect(errors[0]).toEqual(undefined)
      expect(errors[1]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })

    it('handles tasks that return null', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const tasks = [async () => null]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual(null)
      expect(errors[0]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })

    it('handles mix of success, error, and timeout', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 100,
        timeoutPerRunMs: 5000,
      })

      const tasks = [
        async () => 'success',
        async () => {
          throw new Error('error')
        },
        async () => {
          await wait(200)
          return 'timeout'
        },
        async () => 'success2',
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual('success')
      expect(results[1]).toEqual(undefined)
      expect(results[2]).toEqual(undefined)
      expect(results[3]).toEqual('success2')
      expect(errors[0]).toEqual(undefined)
      expect(errors[1]?.message).toEqual('error')
      expect(errors[2]?.message).toEqual('Task timeout')
      expect(errors[3]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })
  })

  describe('type safety', () => {
    it('handles different return types', async () => {
      const workerPool = createWorkerPool({
        count: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      const numberTasks = [async () => 1, async () => 2, async () => 3]

      const resultPromise = workerPool.runInPool(numberTasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results).toEqual([1, 2, 3])
      expect(errors.every((e) => e === undefined)).toEqual(true)
      expect(timedOut).toEqual(false)
    })

    it('handles complex object types', async () => {
      const workerPool = createWorkerPool({
        count: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
      })

      type ComplexType = { id: string; data: number[] }
      const tasks = [
        async (): Promise<ComplexType> => ({
          id: 'test',
          data: [1, 2, 3],
        }),
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results[0]).toEqual({ id: 'test', data: [1, 2, 3] })
      expect(errors[0]).toEqual(undefined)
      expect(timedOut).toEqual(false)
    })
  })
})
