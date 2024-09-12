import { Logger } from '@l2beat/backend-tools'
import { Job, Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { setupWorkerLogging } from '../logging.js'
import { InferQueueDataType, InferQueueResultType } from '../types.js'

type BufferEntry<T> = {
  payload: T
  resolve: (value: void | PromiseLike<void>) => void
  reject: (error: Error) => void
}

/**
 * Collects events from an input queue and aggregates them into a single event
 * forwarded to an output queue.
 * @param inputQueue The queue to collect events from.
 * @param outputQueue The queue to forward the aggregated event to.
 * @param aggregate The function to aggregate many input events into one output event.
 * @param bufferSize The maximum number of events to aggregate before forwarding.
 * @param flushInterval The maximum time to wait before forwarding the aggregated event.
 */
export function setupCollector<
  InputQueue extends Queue,
  OutputQueue extends Queue,
  InputDataType = InferQueueDataType<InputQueue>,
  OutputDataType = InferQueueDataType<OutputQueue>,
  InputResultType = InferQueueResultType<InputQueue>,
>({
  inputQueue,
  outputQueue,
  aggregate,
  bufferSize = 5,
  flushIntervalMs = 10000,
  connection,
  logger,
}: {
  inputQueue: InputQueue
  outputQueue: OutputQueue
  aggregate: (data: InputDataType[]) => OutputDataType
  bufferSize: number
  flushIntervalMs: number
  connection: Redis
  logger: Logger
}) {
  logger = logger.for('EventCollector')
  let buffer: BufferEntry<InputDataType>[] | undefined = undefined

  async function flush() {
    if (!buffer) {
      return
    }

    try {
      logger.debug('Aggregating events')
      const aggregatedEvent = aggregate(
        // biome-ignore lint/style/noNonNullAssertion: checked above
        buffer!.map((entry) => entry.payload),
      )

      logger.debug('Sending aggregated event to output queue', {
        event: aggregatedEvent,
      })
      await outputQueue.add('AggregatedEvent', aggregatedEvent)

      logger.debug('Acknowledging atomic events from input queue')
      buffer?.forEach((entry) => entry.resolve())
    } catch {
      buffer?.forEach((entry) =>
        entry.reject(new Error('Failed to aggregate events')),
      )
    }

    buffer = undefined
  }

  const processor = (
    job: Job<InputDataType, InputResultType, string>,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const entry: BufferEntry<InputDataType> = {
        payload: job.data,
        resolve,
        reject,
      }

      if (!buffer) {
        logger.debug('No buffer, creating new buffer')
        buffer = [entry]

        setTimeout(async () => {
          logger.info('Flushing buffer due to timeout', {
            from: inputQueue.name,
            to: outputQueue.name,
            eventsAggregated: buffer?.length,
          })
          await flush()
        }, flushIntervalMs)
        return
      }

      logger.debug('Adding event to buffer')

      buffer.push(entry)

      if (buffer.length >= bufferSize) {
        logger.info('Buffer full, flushing to output queue', {
          from: inputQueue.name,
          to: outputQueue.name,
          eventsAggregated: buffer.length,
        })
        flush()
      }
    })
  }

  const worker = new Worker<InputDataType>(inputQueue.name, processor, {
    connection,
    concurrency: bufferSize,
  })

  if (logger) {
    setupWorkerLogging({ worker, logger })
  }

  logger.info('Collector setup', {
    bufferSize,
    flushIntervalMs,
    from: inputQueue.name,
    to: outputQueue.name,
  })

  return worker
}
