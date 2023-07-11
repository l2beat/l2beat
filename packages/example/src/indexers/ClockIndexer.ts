import { Indexer, Subscription, UpdateEvent } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

export class ClockIndexer implements Indexer {
  private callbacks: ((event: UpdateEvent) => void)[] = []
  private height = 100

  constructor(private readonly logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async start(): Promise<void> {
    setInterval(() => {
      this.height += 10
      this.callbacks.forEach((cb) =>
        cb({ type: 'update', height: this.height }),
      )
    }, 2_000)
    this.logger.info('Started')
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
