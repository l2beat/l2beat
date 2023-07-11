import { Indexer, Logger, Subscription, UpdateEvent } from '@l2beat/uif'

export class ClockIndexer implements Indexer {
  private callbacks: ((event: UpdateEvent) => void)[] = []
  private height = Date.now()

  constructor(private readonly logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async start(): Promise<void> {
    this.logger.info('Starting')
    return Promise.resolve()
  }

  async callback(): Promise<void> {
    setInterval(() => {
      this.height = Date.now()
      this.callbacks.forEach((cb) =>
        cb({ type: 'update', height: this.height }),
      )
    }, 10_000)
    return Promise.resolve()
  }

  getHeight(): number {
    return this.height
  }

  subscribe(callback: (event: UpdateEvent) => void): Subscription {
    this.callbacks.push(callback)
    return {
      unsubscribe: (): void => {
        this.callbacks = this.callbacks.filter((cb) => cb !== callback)
      },
    }
  }
}
