import { Logger } from '@l2beat/backend-tools'
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
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'task1', name: 'Task 1' },
          job: async () => 'result1',
        },
        {
          identity: { id: 'task2', name: 'Task 2' },
          job: async () => 'result2',
        },
        {
          identity: { id: 'task3', name: 'Task 3' },
          job: async () => 'result3',
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(3)
      expect(results[0].identity.id).toEqual('task1')
      expect(results[0].result).toEqual('result1')
      expect(results[1].identity.id).toEqual('task2')
      expect(results[1].result).toEqual('result2')
      expect(results[2].identity.id).toEqual('task3')
      expect(results[2].result).toEqual('result3')
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })

    it('handles empty task array', async () => {
      const workerPool = createWorkerPool({
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
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
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const executionOrder: number[] = []
      const tasks = Array.from({ length: 5 }, (_, i) => ({
        identity: { id: `task${i}`, name: `Task ${i}` },
        job: async () => {
          executionOrder.push(i)
          await wait(50)
          return i
        },
      }))

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
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'success1', name: 'Success 1' },
          job: async () => 'success1',
        },
        {
          identity: { id: 'failing', name: 'Failing Task' },
          job: async () => {
            throw new Error('Task failed')
          },
        },
        {
          identity: { id: 'success2', name: 'Success 2' },
          job: async () => 'success2',
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(2)
      expect(results[0].identity.id).toEqual('success1')
      expect(results[0].result).toEqual('success1')
      expect(results[1].identity.id).toEqual('success2')
      expect(results[1].result).toEqual('success2')

      expect(errors.length).toEqual(1)
      expect(errors[0].identity.id).toEqual('failing')
      expect(errors[0].error).toBeA(Error)
      expect(errors[0].error.message).toEqual('Task failed')
      expect(timedOut).toEqual(false)
    })

    it('handles non-Error throws', async () => {
      const workerPool = createWorkerPool({
        workerCount: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'string-error', name: 'String Error' },
          job: async () => {
            throw 'string error'
          },
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results).toEqual([])
      expect(errors.length).toEqual(1)
      expect(errors[0].identity.id).toEqual('string-error')
      expect(errors[0].error).toBeA(Error)
      expect(errors[0].error.message).toEqual('string error')
      expect(timedOut).toEqual(false)
    })
  })

  describe('per-task timeout', () => {
    it('times out individual slow tasks', async () => {
      const workerPool = createWorkerPool({
        workerCount: 2,
        timeoutPerTaskMs: 100,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        { identity: { id: 'fast', name: 'Fast' }, job: async () => 'fast' },
        {
          identity: { id: 'slow', name: 'Slow' },
          job: async () => {
            await wait(200)
            return 'slow'
          },
        },
        { identity: { id: 'fast2', name: 'Fast 2' }, job: async () => 'fast2' },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(2)
      expect(results[0].identity.id).toEqual('fast')
      expect(results[0].result).toEqual('fast')
      expect(results[1].identity.id).toEqual('fast2')
      expect(results[1].result).toEqual('fast2')

      expect(errors.length).toEqual(1)
      expect(errors[0].identity.id).toEqual('slow')
      expect(errors[0].error).toBeA(Error)
      expect(errors[0].error.message).toEqual('Task timeout')
      expect(timedOut).toEqual(false)
    })

    it('does not timeout tasks that finish just in time', async () => {
      const workerPool = createWorkerPool({
        workerCount: 1,
        timeoutPerTaskMs: 150,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'just-in-time', name: 'Just in Time' },
          job: async () => {
            await wait(100)
            return 'just-in-time'
          },
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(1)
      expect(results[0].identity.id).toEqual('just-in-time')
      expect(results[0].result).toEqual('just-in-time')
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })
  })

  describe('total run timeout', () => {
    it('stops processing when run timeout is reached', async () => {
      const workerPool = createWorkerPool({
        workerCount: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 200,
        logger: Logger.SILENT,
      })

      const tasks = Array.from({ length: 10 }, (_, i) => ({
        identity: { id: `task${i}`, name: `Task ${i}` },
        job: async () => {
          await wait(100)
          return `result${i}`
        },
      }))

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, timedOut } = await resultPromise

      expect(timedOut).toEqual(true)
      // Not all tasks should complete
      expect(results.length).toBeLessThan(10)
    })

    it('completes all tasks if run finishes before timeout', async () => {
      const workerPool = createWorkerPool({
        workerCount: 3,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 1000,
        logger: Logger.SILENT,
      })

      const tasks = Array.from({ length: 5 }, (_, i) => ({
        identity: { id: `task${i}`, name: `Task ${i}` },
        job: async () => {
          await wait(50)
          return `result${i}`
        },
      }))

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, timedOut } = await resultPromise

      expect(timedOut).toEqual(false)
      expect(results.length).toEqual(5)
      expect(results.map((r) => r.result)).toEqual([
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
        workerCount: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const executionOrder: number[] = []
      const tasks = [0, 1, 2, 3, 4].map((i) => ({
        identity: { id: `task${i}`, name: `Task ${i}` },
        job: async () => {
          executionOrder.push(i)
          await wait(10)
          return i
        },
      }))

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      await resultPromise

      expect(executionOrder).toEqual([0, 1, 2, 3, 4])
    })

    it('processes tasks concurrently with multiple workers', async () => {
      const workerPool = createWorkerPool({
        workerCount: 3,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const startTimes: number[] = []
      const tasks = Array.from({ length: 6 }, (_, i) => ({
        identity: { id: `task${i}`, name: `Task ${i}` },
        job: async () => {
          startTimes.push(Date.now())
          await wait(100)
        },
      }))

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
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      let concurrentCount = 0
      let maxConcurrent = 0

      const tasks = Array.from({ length: 5 }, (_, i) => ({
        identity: { id: `task${i}`, name: `Task ${i}` },
        job: async () => {
          concurrentCount++
          maxConcurrent = Math.max(maxConcurrent, concurrentCount)
          await wait(50)
          concurrentCount--
        },
      }))

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      await resultPromise

      expect(maxConcurrent).toEqual(2)
    })
  })

  describe('edge cases', () => {
    it('handles tasks that return undefined', async () => {
      const workerPool = createWorkerPool({
        workerCount: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'undef', name: 'Undefined' },
          job: async () => undefined,
        },
        { identity: { id: 'value', name: 'Value' }, job: async () => 'value' },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(2)
      expect(results[0].identity.id).toEqual('undef')
      expect(results[0].result).toEqual(undefined)
      expect(results[1].identity.id).toEqual('value')
      expect(results[1].result).toEqual('value')
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })

    it('handles tasks that return null', async () => {
      const workerPool = createWorkerPool({
        workerCount: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        { identity: { id: 'null', name: 'Null' }, job: async () => null },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(1)
      expect(results[0].identity.id).toEqual('null')
      expect(results[0].result).toEqual(null)
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })

    it('handles mix of success, error, and timeout', async () => {
      const workerPool = createWorkerPool({
        workerCount: 2,
        timeoutPerTaskMs: 100,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'success', name: 'Success' },
          job: async () => 'success',
        },
        {
          identity: { id: 'error', name: 'Error' },
          job: async () => {
            throw new Error('error')
          },
        },
        {
          identity: { id: 'timeout', name: 'Timeout' },
          job: async () => {
            await wait(200)
            return 'timeout'
          },
        },
        {
          identity: { id: 'success2', name: 'Success 2' },
          job: async () => 'success2',
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(2)
      expect(results[0].identity.id).toEqual('success')
      expect(results[0].result).toEqual('success')
      expect(results[1].identity.id).toEqual('success2')
      expect(results[1].result).toEqual('success2')

      expect(errors.length).toEqual(2)
      const errorIds = errors.map((e) => e.identity.id).sort()
      expect(errorIds).toEqual(['error', 'timeout'])

      const errorError = errors.find((e) => e.identity.id === 'error')
      expect(errorError?.error.message).toEqual('error')

      const timeoutError = errors.find((e) => e.identity.id === 'timeout')
      expect(timeoutError?.error.message).toEqual('Task timeout')

      expect(timedOut).toEqual(false)
    })
  })

  describe('type safety', () => {
    it('handles different return types', async () => {
      const workerPool = createWorkerPool({
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const numberTasks = [
        { identity: { id: 'one', name: 'One' }, job: async () => 1 },
        { identity: { id: 'two', name: 'Two' }, job: async () => 2 },
        { identity: { id: 'three', name: 'Three' }, job: async () => 3 },
      ]

      const resultPromise = workerPool.runInPool(numberTasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(3)
      expect(results.map((r) => r.result)).toEqual([1, 2, 3])
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })

    it('handles complex object types', async () => {
      const workerPool = createWorkerPool({
        workerCount: 1,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      type ComplexType = { id: string; data: number[] }
      const tasks = [
        {
          identity: { id: 'complex', name: 'Complex' },
          job: async (): Promise<ComplexType> => ({
            id: 'test',
            data: [1, 2, 3],
          }),
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors, timedOut } = await resultPromise

      expect(results.length).toEqual(1)
      expect(results[0].identity.id).toEqual('complex')
      expect(results[0].result).toEqual({ id: 'test', data: [1, 2, 3] })
      expect(errors).toEqual([])
      expect(timedOut).toEqual(false)
    })
  })

  describe('task identity', () => {
    it('includes task identity in results and errors', async () => {
      const workerPool = createWorkerPool({
        workerCount: 2,
        timeoutPerTaskMs: 1000,
        timeoutPerRunMs: 5000,
        logger: Logger.SILENT,
      })

      const tasks = [
        {
          identity: { id: 'project-a', name: 'Project A' },
          job: async () => 'a',
        },
        {
          identity: { id: 'project-b', name: 'Project B' },
          job: async () => 'b',
        },
        {
          identity: { id: 'project-c', name: 'Project C' },
          job: async () => {
            throw new Error('failed')
          },
        },
      ]

      const resultPromise = workerPool.runInPool(tasks)
      await time.runAllAsync()
      const { results, errors } = await resultPromise

      expect(results.length).toEqual(2)
      expect(results[0].identity).toEqual({
        id: 'project-a',
        name: 'Project A',
      })
      expect(results[1].identity).toEqual({
        id: 'project-b',
        name: 'Project B',
      })

      expect(errors.length).toEqual(1)
      expect(errors[0].identity).toEqual({ id: 'project-c', name: 'Project C' })
    })
  })
})
