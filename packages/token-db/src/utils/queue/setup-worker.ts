import { Logger } from '@l2beat/backend-tools'
import { Processor, Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { setupWorkerLogging } from './logging.js'
import { InferQueueDataType, InferQueueResultType } from './types.js'

export function setupWorker<
  EventQueue extends Queue,
  DataType = InferQueueDataType<EventQueue>,
  ResultType = InferQueueResultType<EventQueue>,
>({
  queue,
  connection,
  processor,
  logger,
}: {
  queue: EventQueue
  connection: Redis
  processor: Processor<DataType, ResultType>
  logger?: Logger
}) {
  const worker = new Worker<DataType, ResultType>(queue.name, processor, {
    connection,
    concurrency: 1,
  })

  if (logger) {
    setupWorkerLogging({ worker, logger })
  }

  return worker
}
