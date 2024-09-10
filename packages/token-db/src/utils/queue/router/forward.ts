import { Logger } from '@l2beat/backend-tools'
import { Job, Queue } from 'bullmq'
import { Redis } from 'ioredis'
import { setupWorker } from '../setup-worker.js'
import { InferQueueDataType } from '../types.js'

/**
 * Forward events from one queue to another.
 */
export function forward({
  connection,
  logger,
}: {
  connection: Redis
  logger: Logger
}) {
  return <
    InputQueue extends Queue = Queue,
    InputEvent = InferQueueDataType<InputQueue>,
  >(
    from: InputQueue,
    to: Queue<InputEvent>,
  ) => {
    const forwardWorker = setupWorker({
      queue: from,
      connection,
      processor: async (job: Job<InputEvent>) => {
        await to.add(job.name, job.data, job.opts)
      },
    })

    logger.info('Forwarding rule set', {
      from: from.name,
      to: to.name,
    })

    return forwardWorker
  }
}
