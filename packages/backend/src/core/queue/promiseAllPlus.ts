import { Logger } from '@l2beat/shared'
import { assert, Retries } from '@l2beat/shared-pure'

import { TaskQueue } from './TaskQueue'

export interface PromiseAllThrottledOpts {
  maxConcurrency?: number
  maxAttempts?: number // set to 1 to disable retries
  metricsId: string
}

/**
 * It behaves like Promise.all but:
 * - takes array of functions returning promises instead of promises
 * - can limit concurrency
 * - automatically retries failing tasks couple of times before finally propagating error (just like Promise.all would do)
 * - once permanent error happens no further function will be executed (fail fast)
 */
export async function promiseAllPlus<T>(
  fns: (() => Promise<T>)[],
  logger: Logger,
  opts: PromiseAllThrottledOpts,
) {
  logger = logger.for(promiseAllPlus.name)
  const maxConcurrency = opts.maxConcurrency ?? fns.length
  assert(maxConcurrency > 0)
  const maxAttempts = opts.maxAttempts ?? 10
  assert(maxAttempts > 0)

  let permanentError: unknown
  const results: T[] = []
  const execute = async (id: number) => {
    if (permanentError) {
      return
    }

    results[id] = await fns[id]()
  }

  const taskQueue = new TaskQueue<number>(execute, logger, {
    workers: maxConcurrency,
    // this is quite ugly but we do exponential retries and finally propagate error
    shouldRetry: (job, error) => {
      const shouldRetry = Retries.exponentialBackOff({
        stepMs: 100,
        maxDistanceMs: 3_000,
        maxAttempts: maxAttempts,
      })(job)

      if (!shouldRetry.retry) {
        permanentError = error
      }
      return shouldRetry
    },
    shouldHaltAfterFailedRetries: false, // we have our own strategy to handle that
    metricsId: opts.metricsId,
  })

  fns.forEach((_fn, i) => {
    taskQueue.addToBack(i)
  })

  await taskQueue.waitTillEmpty()

  if (permanentError) {
    throw permanentError
  }

  return results
}
