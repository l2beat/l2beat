import { Logger } from '@l2beat/backend-tools'
import { Job, Queue } from 'bullmq'
import { Redis } from 'ioredis'
import { setupWorker } from '../setup-worker.js'
import { InferQueueDataType } from '../types.js'

type RoutedQueue<Event, RoutingKey> = {
  queue: Queue<Event>
  routingKey: RoutingKey
}

/**
 * Route events from one queue to multiple queues based on a routing key.
 */
export function routingKey({
  connection,
  logger,
}: {
  connection: Redis
  logger: Logger
}) {
  return <
    InputQueue extends Queue = Queue,
    InputEvent = InferQueueDataType<InputQueue>,
    RoutingKey = unknown,
  >({
    from,
    to,
    extractRoutingKey,
  }: {
    from: InputQueue
    to: RoutedQueue<InputEvent, RoutingKey>[]
    extractRoutingKey: (data: InputEvent) => Promise<RoutingKey>
  }) => {
    const queueMap = new Map<RoutingKey, Queue>(
      to.map(({ queue, routingKey }) => [routingKey, queue]),
    )

    if (queueMap.size !== to.length) {
      throw new Error(`Duplicate routing keys for inbox queue: ${from.name}`)
    }

    if (to.length === 0) {
      logger.warn(
        'No queues has been set for routing, messages will be dropped',
      )
    }

    const routingWorker = setupWorker({
      queue: from,
      connection,
      processor: async (job: Job<InputEvent>) => {
        const routingKey = await extractRoutingKey(job.data)
        const queue = queueMap.get(routingKey)
        if (queue) {
          await queue.add(job.name, job.data, job.opts)
        } else {
          logger
            .tag(from.name)
            .debug('No queue for routing key', { routingKey })
        }
      },
    })

    const mapToLog = Object.fromEntries(
      Array.from(queueMap.entries()).map(([key, queue]) => [key, queue.name]),
    )

    logger.info('Routing key rule set', {
      from: from.name,
      routing: mapToLog,
    })

    return routingWorker
  }
}
