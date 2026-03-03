import { v4 as uuidv4 } from 'uuid'
import { formatEcsLog } from '../logger/formatEcsLog'
import type { LogEntry, LoggerTransport } from '../logger/types'
import {
  ElasticSearchClient,
  type ElasticSearchClientOptions,
} from './ElasticSearchClient'

export interface ElasticSearchTransportOptions
  extends ElasticSearchClientOptions {
  flushInterval?: number
  indexPrefix?: string
}

export type UuidProvider = () => string

export class ElasticSearchTransport implements LoggerTransport {
  private readonly buffer: string[]

  constructor(
    private readonly options: ElasticSearchTransportOptions,
    private readonly client: ElasticSearchClient = new ElasticSearchClient(
      options,
    ),
    private readonly uuidProvider: UuidProvider = uuidv4,
  ) {
    this.buffer = []
    this.start()
  }

  log(entry: LogEntry): void {
    this.buffer.push(formatEcsLog(entry))
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

    try {
      const index = await this.createIndex()

      // copy buffer contents as it may change during async operations below
      const batch = [...this.buffer]

      //clear buffer
      this.buffer.splice(0)

      const documents = batch.map((log) => ({
        id: this.uuidProvider(),
        ...JSON.parse(log),
      }))

      const response = await this.client.bulk(documents, index)

      if (!response.isSuccess) {
        throw new Error('Failed to push logs to Elastic Search node', {
          cause: {
            documentErrors: response.errors,
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
                    cause: error instanceof Error ? (error.cause ?? '') : '',
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
}

export function formatDate(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  return `${padStart(date.getDate())}-${padStart(
    date.getMonth() + 1,
  )}-${date.getFullYear()}`
}
