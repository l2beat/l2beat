import { Logger } from '@l2beat/backend-tools'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'

import { BaseIndexer } from './BaseIndexer'
import { Indexer, Subscription, UpdateEvent } from './Indexer'

describe(BaseIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  it('updates when dependencies are updated', async () => {
    const [dep1, dep2] = [new SpyParent(), new SpyParent()]
    const indexer = new SpyIndexer(Logger.SILENT, [dep1, dep2], {
      batchSize: 5,
    })

    dep1.progress(3)
    expect(indexer.update).not.toHaveBeenCalled() // not called yet because all dependencies are not updated
    dep2.progress(2)
    await time.nextAsync()

    expect(indexer.update).toHaveBeenCalledWith(0, 2) // called with the lowest height
    expect(indexer.getHeight()).toEqual(2)
  })

  it('updates in batches', async () => {
    const [dep1] = [new SpyParent(), new SpyParent()]
    const indexer = new SpyIndexer(Logger.SILENT, [dep1], { batchSize: 5 })

    dep1.progress(6)
    await time.nextAsync()

    expect(indexer.update).toHaveBeenCalledWith(0, 5)
    expect(indexer.update).toHaveBeenCalledWith(6, 6)
    expect(indexer.getHeight()).toEqual(6)
  })

  it('enters error state when failed to update', async () => {
    const [dep1] = [new SpyParent(), new SpyParent()]
    const indexer = new SpyIndexer(Logger.SILENT, [dep1], { batchSize: 1 })
    indexer.update.rejectsWithOnce(new Error('Failed to update'))

    dep1.progress(1)
    await time.nextAsync()

    expect(indexer.update).toHaveBeenOnlyCalledWith(0, 1) // called with the lowest height
    expect(indexer.getState()).toEqual({
      batchSize: 1,
      parentHeights: [1],
      height: 0,
      status: 'errored',
    })
  })
})

class SpyIndexer extends BaseIndexer {
  update = mockFn<BaseIndexer['update']>().resolvesTo()
  invalidate = mockFn<BaseIndexer['invalidate']>().resolvesTo()
  setHeight = mockFn<BaseIndexer['setHeight']>().resolvesTo()
}

class SpyParent implements Indexer {
  private height = 0
  private subscribers: ((event: UpdateEvent) => void)[] = []

  subscribe(callback: (event: UpdateEvent) => void): Subscription {
    this.subscribers.push(callback)

    return {
      unsubscribe: (): void => {
        this.subscribers = this.subscribers.filter(
          (subscriber) => subscriber !== callback,
        )
      },
    }
  }

  progress(height: number): void {
    this.height = height
    this.subscribers.forEach((subscriber) =>
      subscriber({ type: 'update', height }),
    )
  }

  start(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getHeight(): number {
    return this.height
  }
}
