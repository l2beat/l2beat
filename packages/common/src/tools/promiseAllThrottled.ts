import { assert } from './assert'
import { Logger } from './Logger'
import { TaskQueue } from './queue/TaskQueue'

export interface PromiseAllThrottledOpts {
  maxConcurrency?: number
}

export async function promiseAllThrottled<T>(
  fns: (() => Promise<T>)[],
  logger: Logger,
  opts?: PromiseAllThrottledOpts,
) {
  logger = logger.for('promiseAllThrottled')
  const maxConcurrency = opts?.maxConcurrency ?? fns.length
  assert(maxConcurrency > 0, 'maxConcurrency set <= 0')

  const results: T[] = []
  const execute = async (id: number) => {
    logger.debug('Executing', { id })

    results[id] = await fns[id]()
  }

  const taskQueue = new TaskQueue<number>(execute, logger, {
    workers: maxConcurrency,
  })

  fns.forEach((_fn, i) => {
    taskQueue.addToBack(i)
  })

  await taskQueue.waitTilEmpty()

  return results
}
