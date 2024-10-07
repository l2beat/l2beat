import { Logger } from '@l2beat/backend-tools'
import {
  WorkerOptions as BullWorkerOptions,
  Processor,
  Queue,
  Worker,
} from 'bullmq'
import { Redis } from 'ioredis'
import { setupWorkerLogging } from './logging.js'
import { InferQueueDataType, InferQueueResultType } from './types.js'

type WorkerOptions = Pick<BullWorkerOptions, 'concurrency'>

export function setupWorker<
  EventQueue extends Queue,
  DataType = InferQueueDataType<EventQueue>,
  ResultType = InferQueueResultType<EventQueue>,
>({
  queue,
  connection,
  processor,
  logger,
  workerOptions,
}: {
  queue: EventQueue
  connection: Redis
  processor: Processor<DataType>
  logger?: Logger
  workerOptions?: WorkerOptions
}) {
  const worker = new Worker<DataType, ResultType, string>(
    queue.name,
    processor,
    {
      connection,
      concurrency: 1,
      autorun: false,
      ...workerOptions,
    },
  )

  if (logger) {
    setupWorkerLogging({ worker, logger })
  }

  return worker
}
