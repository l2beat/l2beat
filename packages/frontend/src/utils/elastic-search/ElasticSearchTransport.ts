import { formatDate, type LoggerTransport } from '@l2beat/backend-tools'
import { v4 as uuidv4 } from 'uuid'
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

  public debug(message: string): void {
    this.buffer.push(message)
  }

  public log(message: string): void {
    this.buffer.push(message)
  }

  public warn(message: string): void {
    this.buffer.push(message)
  }

  public error(message: string): void {
    this.buffer.push(message)
  }

  private start(): void {
    const interval = setInterval(async () => {
      await this.flushLogs()
    }, this.options.flushInterval ?? 10000)

    // object will not require the Node.js event loop to remain active
    // nodejs.org/api/timers.html#timers_timeout_unref
    interval.unref()
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
