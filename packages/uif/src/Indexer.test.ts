import { Logger } from '@l2beat/backend-tools'
import { install } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'

import { Indexer } from './Indexer'
import { ChildIndexer } from './indexers/ChildIndexer'
import { RootIndexer } from './indexers/RootIndexer'
import type { RetryStrategy } from './Retries'
import type { IndexerAction } from './reducer/types/IndexerAction'

describe(Indexer.name, () => {
  describe('correctly initializes', () => {
    it('dispatches Initialized if state is returned', async () => {
      const safeHeight = 100
      const testIndexer = new InitTestIndexer({ safeHeight })
      await testIndexer.start()

      expect(testIndexer.getState().height).toEqual(safeHeight)
      expect(testIndexer.getState().initializedSelf).toEqual(true)
    })

    it('does not dispatch Initialized if state is undefined', async () => {
      const testIndexer = new InitTestIndexer(undefined)
      await testIndexer.start()

      expect(testIndexer.getState().height).toEqual(0)
      expect(testIndexer.getState().initializedSelf).toEqual(false)
    })
  })

  describe('correctly informs about updates', () => {
    it('first invalidate then parent update', async () => {
      const parent = new TestRootIndexer(0)
      const child = new TestChildIndexer([parent], 0)

      await parent.start()
      await child.start()

      await child.finishInvalidate(0)
      await parent.doTick(1)
      await parent.finishTick(1)

      await child.finishUpdate(1)

      expect(await child.initialize()).toEqual({ safeHeight: 1 })
    })

    it('first parent update then invalidate', async () => {
      const parent = new TestRootIndexer(0)
      const child = new TestChildIndexer([parent], 0)

      await parent.start()
      await child.start()

      await parent.doTick(1)
      await parent.finishTick(1)
      await child.finishInvalidate(0)

      await child.finishUpdate(1)

      expect(await child.initialize()).toEqual({ safeHeight: 1 })
    })
  })

  describe('complex scenario', () => {
    // notation:
    // Pi - parent indexer
    // Mi - middle indexer
    // Ci - child indexer
    it('When Mi updating, passes correctly safeHeight', async () => {
      const parent = new TestRootIndexer(0)
      const middle = new TestChildIndexer([parent], 0, 'Middle')
      const child = new TestChildIndexer([middle], 0, 'Child')

      await parent.start()
      await middle.start()
      await child.start()

      await middle.finishInvalidate(0)
      await child.finishInvalidate(0)

      await parent.doTick(10)
      await parent.finishTick(10)
      await middle.finishUpdate(10)

      expect(child.getState().status).toEqual('updating')

      await parent.doTick(5)
      await parent.finishTick(5)

      expect(middle.getState().waiting).toEqual(true)
    })
  })

  describe('retries on error', () => {
    it('invalidates and retries update', async () => {
      const clock = install({ shouldAdvanceTime: true, advanceTimeDelta: 1 })

      const parent = new TestRootIndexer(0)

      const shouldRetry = mockFn(() => true)
      const markAttempt = mockFn(() => {})
      const clear = mockFn(() => {})

      const child = new TestChildIndexer([parent], 0, '', {
        updateRetryStrategy: {
          shouldRetry,
          markAttempt,
          timeoutMs: () => 1000,
          clear,
          attempts: () => 1,
        },
      })

      await parent.start()
      await child.start()

      await child.finishInvalidate(0)

      await parent.doTick(1)
      await parent.finishTick(1)

      await child.finishUpdate(new Error('test error'))
      expect(child.updating).toBeFalsy()
      expect(child.invalidating).toBeTruthy()
      expect(shouldRetry).toHaveBeenCalledTimes(1)
      expect(markAttempt).toHaveBeenCalledTimes(1)

      await child.finishInvalidate(0)
      expect(child.getState().status).toEqual('idle')

      await clock.tickAsync(1000)

      expect(child.getState().status).toEqual('updating')
      await child.finishUpdate(1)

      expect(clear).toHaveBeenCalledTimes(1)
      expect(child.getState().status).toEqual('idle')

      clock.uninstall()
    })

    it('retries invalidate', async () => {
      const clock = install({ shouldAdvanceTime: true, advanceTimeDelta: 1 })
      const parent = new TestRootIndexer(0)
      const invalidateShouldRetry = mockFn(() => true)
      const invalidateMarkAttempt = mockFn(() => {})
      const invalidateClear = mockFn(() => {})

      const updateShouldRetry = mockFn(() => true)
      const updateMarkAttempt = mockFn(() => {})
      const updateClear = mockFn(() => {})

      const child = new TestChildIndexer([parent], 0, '', {
        invalidateRetryStrategy: {
          shouldRetry: invalidateShouldRetry,
          markAttempt: invalidateMarkAttempt,
          timeoutMs: () => 1000,
          clear: invalidateClear,
          attempts: () => 1,
        },
        updateRetryStrategy: {
          shouldRetry: updateShouldRetry,
          markAttempt: updateMarkAttempt,
          timeoutMs: () => 1000,
          clear: updateClear,
          attempts: () => 1,
        },
      })

      await parent.start()
      await child.start()

      await child.finishInvalidate(0)
      expect(invalidateClear).toHaveBeenCalledTimes(1)

      await parent.doTick(1)
      await parent.finishTick(1)

      await child.finishUpdate(new Error('test error'))
      expect(updateShouldRetry).toHaveBeenCalledTimes(1)
      expect(updateMarkAttempt).toHaveBeenCalledTimes(1)

      await child.finishInvalidate(new Error('test error'))
      expect(invalidateMarkAttempt).toHaveBeenCalledTimes(1)
      expect(invalidateShouldRetry).toHaveBeenCalledTimes(1)
      expect(child.getState().status).toEqual('idle')

      await clock.tickAsync(1000)

      expect(child.getState().status).toEqual('invalidating')
      expect(child.invalidating).toBeTruthy()

      await child.finishInvalidate(0)
      expect(invalidateClear).toHaveBeenCalledTimes(2)
      expect(child.getState().status).toEqual('updating')
      expect(child.updating).toBeTruthy()

      await child.finishUpdate(1)
      expect(updateClear).toHaveBeenCalledTimes(1)
      expect(child.getState().status).toEqual('idle')
      clock.uninstall()
    })

    it('invalidates and retries tick', async () => {
      const clock = install({ shouldAdvanceTime: true, advanceTimeDelta: 1 })
      const shouldRetry = mockFn(() => true)
      const markAttempt = mockFn(() => {})
      const clear = mockFn(() => {})

      const root = new TestRootIndexer(0, '', {
        tickRetryStrategy: {
          shouldRetry,
          markAttempt,
          timeoutMs: () => 1000,
          clear,
          attempts: () => 1,
        },
      })

      await root.start()

      await root.doTick(1)
      await root.finishTick(new Error('test error'))
      expect(markAttempt).toHaveBeenCalledTimes(1)
      expect(shouldRetry).toHaveBeenCalledTimes(1)
      expect(root.getState().status).toEqual('idle')
      expect(root.getState().tickBlocked).toEqual(true)

      await clock.tickAsync(1000)

      expect(root.getState().status).toEqual('ticking')

      await root.finishTick(1)
      expect(clear).toHaveBeenCalledTimes(1)
      expect(root.getState().status).toEqual('idle')
      expect(root.getState().tickBlocked).toEqual(false)

      clock.uninstall()
    })
  })

  it('calls update with correct heights', async () => {
    const parent = new TestRootIndexer(100)
    const child = new TestChildIndexer([parent], 100)

    await parent.start()
    await child.start()
    await child.finishInvalidate(100)

    await parent.doTick(200)
    await parent.finishTick(200)

    expect(child.updateFrom).toEqual(101) // inclusive
    expect(child.updateTo).toEqual(200) // inclusive

    await child.finishUpdate(200)
  })
})

export async function waitUntil(predicate: () => boolean): Promise<void> {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval)
        resolve()
      }
    }, 0)
  })
}

export class InitTestIndexer extends RootIndexer {
  constructor(
    private readonly initState:
      | { safeHeight: number; configHash?: string }
      | undefined,
  ) {
    super(Logger.SILENT)
  }

  override async tick(): Promise<number> {
    return Promise.resolve(0)
  }

  override async initialize() {
    return Promise.resolve(this.initState)
  }
}

export class TestRootIndexer extends RootIndexer {
  public resolveTick: (height: number) => void = () => {}
  public rejectTick: (error: unknown) => void = () => {}

  dispatchCounter = 0
  ticking = false

  constructor(
    private testSafeHeight: number,
    name?: string,
    retryStrategy?: { tickRetryStrategy?: RetryStrategy },
  ) {
    super(Logger.SILENT.tag({ tag: name }), retryStrategy ?? {})

    const oldDispatch = Reflect.get(this, 'dispatch')
    Reflect.set(this, 'dispatch', (action: IndexerAction) => {
      oldDispatch.call(this, action)
      this.dispatchCounter++
    })
  }

  async doTick(height: number): Promise<void> {
    await waitUntil(() => this.getState().status === 'idle')
    this.testSafeHeight = height
    const counter = this.dispatchCounter
    this.requestTick()
    await waitUntil(() => this.dispatchCounter > counter)
  }

  async finishTick(result: number | Error): Promise<void> {
    await waitUntil(() => this.ticking)
    const counter = this.dispatchCounter
    if (typeof result === 'number') {
      this.resolveTick(result)
    } else {
      this.rejectTick(result)
    }
    await waitUntil(() => this.dispatchCounter > counter)
  }

  override async tick(): Promise<number> {
    this.ticking = true

    return new Promise<number>((resolve, reject) => {
      this.resolveTick = resolve
      this.rejectTick = reject
    }).finally(() => {
      this.ticking = false
    })
  }

  override async initialize() {
    const promise = this.tick()
    this.resolveTick(this.testSafeHeight)
    await promise
    return { safeHeight: this.testSafeHeight }
  }
}

class TestChildIndexer extends ChildIndexer {
  public resolveUpdate: (height: number) => void = () => {}
  public rejectUpdate: (error: unknown) => void = () => {}
  public resolveInvalidate: (to: number) => void = () => {}
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

  async finishInvalidate(result: number | Error): Promise<void> {
    await waitUntil(() => this.invalidating)
    const counter = this.dispatchCounter
    if (typeof result === 'number') {
      this.resolveInvalidate(result)
    } else {
      this.rejectInvalidate(result)
    }
    await waitUntil(() => this.dispatchCounter > counter)
  }

  public invalidating = false
  public invalidateTo = 0

  constructor(
    parents: Indexer[],
    private testSafeHeight: number,
    name?: string,
    retryStrategy?: {
      invalidateRetryStrategy?: RetryStrategy
      updateRetryStrategy?: RetryStrategy
    },
  ) {
    super(Logger.SILENT.tag({ tag: name }), parents, retryStrategy ?? {})

    const oldDispatch = Reflect.get(this, 'dispatch')
    Reflect.set(this, 'dispatch', (action: IndexerAction) => {
      oldDispatch.call(this, action)
      this.dispatchCounter++
    })
  }

  override initialize() {
    return Promise.resolve({ safeHeight: this.testSafeHeight })
  }

  override setSafeHeight(safeHeight: number) {
    this.testSafeHeight = safeHeight
    return Promise.resolve()
  }

  override setInitialState(
    _safeHeight: number,
    _configHash?: string | undefined,
  ): Promise<void> {
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

  override async invalidate(to: number): Promise<number> {
    this.invalidating = true
    this.invalidateTo = to
    return new Promise<number>((resolve, reject) => {
      this.resolveInvalidate = resolve
      this.rejectInvalidate = reject
    }).finally(() => {
      this.invalidating = false
    })
  }
}
