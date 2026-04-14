import { v4 as uuidv4 } from 'uuid'
import { formatEcsLog } from '../logger/formatEcsLog'
import type { LogEntry, LoggerTransport } from '../logger/types'
import {
  ElasticSearchClient,
  type ElasticSearchClientOptions,
} from './ElasticSearchClient'

export interface ElasticSearchTransportOptions
  extends ElasticSearchClientOptions {
  /** Max total UTF-8 byte size of buffered strings before oldest items are dropped at flush. */
  bufferMaxBytes?: number
  flushInterval?: number
  indexPrefix?: string
}

export type UuidProvider = () => string

export const DEFAULT_BUFFER_MAX_BYTES = 128 * 1024 * 1024 // 128 MiB

export class ElasticSearchTransport implements LoggerTransport {
  private readonly buffer: string[]
  private readonly bufferMaxBytes: number

  constructor(
    private readonly options: ElasticSearchTransportOptions,
    private readonly client: ElasticSearchClient = new ElasticSearchClient(
      options,
    ),
    private readonly uuidProvider: UuidProvider = uuidv4,
  ) {
    this.buffer = []
    this.bufferMaxBytes = options.bufferMaxBytes ?? DEFAULT_BUFFER_MAX_BYTES
    this.start()
  }

  log(entry: LogEntry): void {
    this.push(formatEcsLog(entry))
  }

  push(log: string) {
    this.buffer.push(log)
  }

  private start(): void {
    const interval = setInterval(async () => {
      await this.flushLogs()
    }, this.options.flushInterval ?? 10000)

    // object will not require the Node.js event loop to remain active
    // nodejs.org/api/timers.html#timers_timeout_unref
    interval.unref()
  }

  /**
   * Manually flush all buffered logs to Elastic Search.
   * This should be called before the process exits to ensure all logs are sent.
   */
  public async flush(): Promise<void> {
    await this.flushLogs()
  }

  private async flushLogs(): Promise<void> {
    if (!this.buffer.length) {
      return
    }

    const { droppedItems, droppedBytes } = this.trimOverflow()
    if (droppedItems > 0) {
      void this.reportBufferOverflow(droppedItems, droppedBytes)
    }

    /** In scope for `catch` so we can correlate flush failures with batched log strings. */
    let batch: string[] = []

    try {
      const index = await this.createIndex()

      // copy buffer contents as it may change during async operations below
      batch = [...this.buffer]

      //clear buffer
      this.buffer.splice(0)

      const documents = batch.map((log) => ({
        id: this.uuidProvider(),
        ...JSON.parse(log),
      }))

      const response = await this.client.bulk(documents, index)

      if (!response.isSuccess) {
        throw new Error('Failed to push some logs to Elastic Search node', {
          cause: {
            failedDocuments: JSON.stringify(response.failedDocuments),
          },
        })
      }
    } catch (error) {
      console.log(error)
      try {
        // We want to get notified in case there is a "push time error"
        // e.g. fields types collision https://github.com/l2beat/l2beat/pull/10136
        // There is an additional Alert set in Kibana for this.
        await this.client.bulk(
          [
            {
              id: this.uuidProvider(),
              ...JSON.parse(
                formatEcsLog({
                  time: new Date(),
                  level: 'ERROR',
                  message: error instanceof Error ? error.message : '',
                  parameters: {
                    cause:
                      error instanceof Error
                        ? (error.cause ?? undefined)
                        : undefined,
                  },
                }),
              ),
            },
          ],
          await this.createIndex(),
        )
      } catch {}
    }
  }

  private async createIndex(): Promise<string> {
    const indexName = `${this.options.indexPrefix ?? 'logs'}-${formatDate(
      new Date(),
    )}`

    const exist = await this.client.indexExist(indexName)
    if (!exist) {
      await this.client.indexCreate(indexName)
    }
    return indexName
  }

  /**
   * Drops whole items from the front of the buffer until total UTF-8 byte size
   * is at most `bufferMaxBytes`.
   */
  private trimOverflow(): {
    droppedItems: number
    droppedBytes: number
  } {
    let totalBytes = sumBufferUtf8Bytes(this.buffer)
    if (totalBytes <= this.bufferMaxBytes) {
      return { droppedItems: 0, droppedBytes: 0 }
    }

    let droppedItems = 0
    let droppedBytes = 0
    while (totalBytes > this.bufferMaxBytes && this.buffer.length > 0) {
      const item = this.buffer.shift()
      if (item === undefined) {
        break
      }
      const itemBytes = Buffer.byteLength(item, 'utf8')
      droppedBytes += itemBytes
      droppedItems += 1
      totalBytes -= itemBytes
    }
    return { droppedItems, droppedBytes }
  }

  private async reportBufferOverflow(
    droppedItems: number,
    droppedBytes: number,
  ): Promise<void> {
    try {
      await this.client.bulk(
        [
          {
            id: this.uuidProvider(),
            ...JSON.parse(
              formatEcsLog({
                time: new Date(),
                level: 'CRITICAL',
                message: 'Elastic Search transport buffer overflowed',
                parameters: {
                  droppedItems,
                  droppedBytes,
                  bufferMaxBytes: this.bufferMaxBytes,
                },
              }),
            ),
          },
        ],
        await this.createIndex(),
      )
    } catch {}
  }
}

function sumBufferUtf8Bytes(buffer: string[]): number {
  let sum = 0
  for (const item of buffer) {
    sum += Buffer.byteLength(item, 'utf8')
  }
  return sum
}

export function formatDate(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  return `${padStart(date.getDate())}-${padStart(
    date.getMonth() + 1,
  )}-${date.getFullYear()}`
}
