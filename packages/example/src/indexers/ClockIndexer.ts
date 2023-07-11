import { Indexer, Subscription, UpdateEvent } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

export class ClockIndexer implements Indexer {
  private children: Indexer[] = []
  private height = 100

  constructor(private readonly logger: Logger) {
    this.logger = this.logger.for(this)
  }

  async start(): Promise<void> {
    setInterval(() => {
      this.height += 10
      this.children.forEach((c) => c.notifyUpdate(this, this.height))
    }, 2_000)
    this.logger.info('Started')
    return Promise.resolve()
  }

  getHeight(): number {
    return this.height
  }

  subscribe(child: Indexer): Subscription {
    this.children.push(child)
    return {
      unsubscribe: (): void => {
        this.children = this.children.filter((c) => c !== child)
      },
    }
  }

  notifyReady(child: Indexer): void {
    this.logger.debug('Someone is ready', { child: child.constructor.name })
  }

  notifyUpdate(): void {
    throw new Error('No parents!')
  }
}
