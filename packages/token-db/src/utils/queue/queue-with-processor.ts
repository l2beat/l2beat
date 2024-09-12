import { Logger } from '@l2beat/backend-tools'
import { Processor } from 'bullmq'
import { Redis } from 'ioredis'
import { setupQueue } from './setup-queue.js'
import { setupWorker } from './setup-worker.js'

type EventProcessor<Event> = {
  name: string
  processor: Processor<Event>
}

export function setupQueueWithProcessor({
  connection,
  logger,
}: { connection: Redis; logger: Logger }) {
  return <Event = unknown>({ name, processor }: EventProcessor<Event>) => {
    const queueLogger = logger.for(name)
    const queue = setupQueue({
      connection,
    })<Event>({ name })

    const worker = setupWorker({
      queue,
      connection,
      processor,
      logger: queueLogger,
    })

    queueLogger.info('Queue with processor created')

    return { queue, worker }
  }
}
