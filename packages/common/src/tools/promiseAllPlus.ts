import { assert } from './assert'
import { Logger } from './Logger'
import { Retries } from './queue/Retries'
import { TaskQueue } from './queue/TaskQueue'

export interface PromiseAllThrottledOpts {
  maxConcurrency?: number
}

/**
 * It behaves like Promise.all but:
 * - takes array of functions returning promises instead of promises
 * - can limit concurrency
 * - automatically retries failing tasks couple of times before finally propagating error (just like Promise.all would do)
 */
export async function promiseAllPlus<T>(
  fns: (() => Promise<T>)[],
  logger: Logger,
  opts?: PromiseAllThrottledOpts,
) {
  logger = logger.for(promiseAllPlus.name)
  const maxConcurrency = opts?.maxConcurrency ?? fns.length
  assert(maxConcurrency > 0, 'maxConcurrency set <= 0')

  const results: T[] = []
  const execute = async (id: number) => {
    results[id] = await fns[id]()
  }

  let permanentError: unknown
  const taskQueue = new TaskQueue<number>(execute, logger, {
    workers: maxConcurrency,
    // this is quite ugly but we do exponential retries and finally propagate error
    shouldRetry: (job, error) => {
      const shouldRetry = Retries.exponentialBackOff(100, {
        maxDistanceMs: 3_000,
        maxAttempts: 10,
      })(job)

      if (!shouldRetry.retry) {
        permanentError = error
      }
      return shouldRetry
    },
  })

  fns.forEach((_fn, i) => {
    taskQueue.addToBack(i)
  })

  await taskQueue.waitTilEmpty()

  if (permanentError) {
    throw permanentError
  }

  return results
}
