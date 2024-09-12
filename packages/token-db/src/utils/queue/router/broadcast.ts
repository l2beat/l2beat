import { Logger } from '@l2beat/backend-tools'
import { Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { InferQueueDataType } from '../types.js'

/**
 * Broadcast events from one queue to multiple queues.
 */
export function broadcast({
  connection,
  logger,
}: { connection: Redis; logger: Logger }) {
  return <
    InputQueue extends Queue = Queue,
    InputEvent = InferQueueDataType<InputQueue>,
  >({
    from,
    to,
  }: {
    from: InputQueue
    to: Queue<InputEvent>[]
  }) => {
    const broadcastWorker = new Worker<InputEvent>(
      from.name,
      async (job) => {
        to.forEach((queue) => {
          queue.add(job.name, job.data, job.opts)
        })
      },
      { connection },
    )

    logger.info('Broadcast rule set', {
      from: from.name,
      to: to.map((queue) => queue.name),
    })

    return broadcastWorker
  }
}
