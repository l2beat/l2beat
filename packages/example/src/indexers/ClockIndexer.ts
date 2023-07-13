import { Indexer, Subscription, UpdateEvent } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'
import assert from 'assert'

export class ClockIndexer implements Indexer {
  private children: Indexer[] = []
  private childrenReady: boolean[] = []
  private height = 100
  private reorgs: (() => void)[] = []

  constructor(private readonly logger: Logger) {
    this.logger = this.logger.for(this)
  }

  startUpdating() {
    this.logger.info('Starting to update')
    const interval = setInterval(() => {
      this.height += 10
      this.children.forEach((c) => c.notifyUpdate(this, this.height))
    }, 2_000)
    return () => clearInterval(interval)
  }

  async start(): Promise<void> {
    const stop = this.startUpdating()
    // reorg after 10 seconds

    setTimeout(() => {
      stop()
      this.reorg(50)
    }, 10_000)
    this.logger.info('Started')
    return Promise.resolve()
  }

  getHeight(): number {
    return this.height
  }

  subscribe(child: Indexer): Subscription {
    this.children.push(child)
    this.childrenReady.push(false)
    return {
      unsubscribe: (): void => {
        const index = this.children.indexOf(child)
        assert(index !== -1, 'Received unsubscribe from unknown child')

        this.children = this.children.filter((_, i) => i !== index)
        this.childrenReady = this.childrenReady.filter((_, i) => i !== index)
      },
    }
  }

  reorg(to: number): void {
    console.log('waiting fo reorg')
    this.children.forEach((c) => c.notifyUpdate(this, to))
    this.children.forEach((c) => c.notifyWaiting(this))
    this.reorgs.push(() => {
      console.log('reorg')
      this.children.forEach((c) => c.notifyInvalidated(this, to))
      this.height = to
      this.startUpdating()
    })
  }

  notifyReady(child: Indexer): void {
    this.logger.debug('Someone is ready', { child: child.constructor.name })
    const index = this.children.indexOf(child)
    assert(index !== -1, 'Received ready from unknown child')
    this.childrenReady[index] = true
    if (this.childrenReady.every((r) => r)) {
      const reorg = this.reorgs.shift()
      if (reorg) {
        reorg()
      }
      this.children.forEach((c) => c.notifyInvalidated(this, this.height))
    }
  }

  notifyUpdate(): void {
    throw new Error('No parents!')
  }

  notifyInvalidated(): void {
    throw new Error('No parents!')
  }

  notifyWaiting(): void {
    throw new Error('No parents!')
  }
}
