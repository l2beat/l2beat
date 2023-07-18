import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'

import { BaseIndexer, ChildIndexer, RootIndexer } from './BaseIndexer'
import { IndexerAction } from './reducer/types/IndexerAction'

describe(BaseIndexer.name, () => {
  describe('correctly informs about updates', () => {
    it('first invalidate then parent update', async () => {
      const parent = new TestRootIndexer(0)
      const child = new TestChildIndexer([parent], 0)

      await parent.start()
      await child.start()

      await child.finishInvalidate()
      await parent.doTick(1)

      await child.finishUpdate(1)

      expect(await child.getSafeHeight()).toEqual(1)
    })

    it('first parent update then invalidate', async () => {
      const parent = new TestRootIndexer(0)
      const child = new TestChildIndexer([parent], 0)

      await parent.start()
      await child.start()

      await parent.doTick(1)
      await child.finishInvalidate()

      await child.finishUpdate(1)

      expect(await child.getSafeHeight()).toEqual(1)
    })
  })

  describe('complex scenario', () => {
    // notation:
    // Pi - parent indexer
    // Mi - middle indexer
    // Ci - child indexer
    it('When Mi updating, passes correcty safeHeight', async () => {
      const parent = new TestRootIndexer(0)
      const middle = new TestChildIndexer([parent], 0, 'Middle')
      const child = new TestChildIndexer([middle], 0, 'Child')

      await parent.start()
      await middle.start()
      await child.start()

      await middle.finishInvalidate()
      await child.finishInvalidate()

      await parent.doTick(10)
      await middle.finishUpdate(10)

      expect(child.getState().status).toEqual('updating')

      await parent.doTick(5)

      expect(middle.getState().waiting).toEqual(true)
    })
  })
})

async function waitUntil(predicate: () => boolean): Promise<void> {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval)
        resolve()
      }
    }, 0)
  })
}

class TestRootIndexer extends RootIndexer {
  dispatchCounter = 0

  constructor(private safeHeight: number, name?: string) {
    super(Logger.SILENT.tag(name))

    const oldDispatch = Reflect.get(this, 'dispatch')
    Reflect.set(this, 'dispatch', (action: IndexerAction) => {
      oldDispatch.call(this, action)
      this.dispatchCounter++
    })
  }

  async doTick(height: number): Promise<void> {
    await waitUntil(() => this.getState().status === 'idle')
    this.safeHeight = height
    const counter = this.dispatchCounter
    this.requestTick()
    await waitUntil(() => this.dispatchCounter > counter)
  }

  override tick(): Promise<number> {
    return Promise.resolve(this.safeHeight)
  }
}

class TestChildIndexer extends ChildIndexer {
  public resolveUpdate: (height: number) => void = () => {}
  public rejectUpdate: (error: unknown) => void = () => {}
  public resolveInvalidate: () => void = () => {}
  public rejectInvalidate: (error: unknown) => void = () => {}

  public updating = false
  public updateFrom = 0
  public updateTo = 0

  public dispatchCounter = 0

  async finishUpdate(result: number | Error): Promise<void> {
    await waitUntil(() => this.updating)
    const counter = this.dispatchCounter
    if (typeof result === 'number') {
      this.resolveUpdate(result)
    } else {
      this.rejectUpdate(result)
    }
    await waitUntil(() => this.dispatchCounter > counter)
  }

  async finishInvalidate(result?: Error): Promise<void> {
    await waitUntil(() => this.invalidating)
    const counter = this.dispatchCounter
    if (!result) {
      this.resolveInvalidate()
    } else {
      this.rejectInvalidate(result)
    }
    await waitUntil(() => this.dispatchCounter > counter)
  }

  public invalidating = false
  public invalidateTo = 0

  constructor(
    parents: BaseIndexer[],
    private safeHeight: number,
    name?: string,
  ) {
    super(Logger.SILENT.tag(name), parents)

    const oldDispatch = Reflect.get(this, 'dispatch')
    Reflect.set(this, 'dispatch', (action: IndexerAction) => {
      oldDispatch.call(this, action)
      this.dispatchCounter++
    })
  }

  override getSafeHeight(): Promise<number> {
    return Promise.resolve(this.safeHeight)
  }

  override setSafeHeight(safeHeight: number): Promise<void> {
    this.safeHeight = safeHeight
    return Promise.resolve()
  }

  override async update(from: number, to: number): Promise<number> {
    this.updating = true
    this.updateFrom = from
    this.updateTo = to
    return new Promise<number>((resolve, reject) => {
      this.resolveUpdate = resolve
      this.rejectUpdate = reject
    }).finally(() => {
      this.updating = false
    })
  }

  override async invalidate(to: number): Promise<void> {
    this.invalidating = true
    this.invalidateTo = to
    return new Promise<void>((resolve, reject) => {
      this.resolveInvalidate = resolve
      this.rejectInvalidate = reject
    }).finally(() => {
      this.invalidating = false
    })
  }
}
