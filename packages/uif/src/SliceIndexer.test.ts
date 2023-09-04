import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'

import { BaseIndexer } from './BaseIndexer'
import { TestRootIndexer, waitUntil } from './BaseIndexer.test'
import { IndexerAction } from './reducer/types/IndexerAction'
import { RetryStrategy } from './Retries'
import {
  diffSlices,
  SliceHash,
  SliceIndexer,
  SliceState,
  SliceUpdate,
} from './SliceIndexer'

describe(SliceIndexer.name, () => {
  it('updates multiple slices', async () => {
    const repository = testRepositoryFactory()

    const rootIndexer = new TestRootIndexer(0)
    const sliceIndexer = new TestSliceIndexer(
      ['token-a', 'token-b', 'token-c'],
      repository,
      [rootIndexer],
    )

    await rootIndexer.start()
    await sliceIndexer.start()

    await sliceIndexer.finishInvalidate(0)
    await rootIndexer.doTick(1)
    await rootIndexer.finishTick(1)

    expect(repository.getSliceData('token-a').get(1)).toEqual(2)
    expect(repository.getSliceData('token-b').get(1)).toEqual(2)
    expect(repository.getSliceData('token-c').get(1)).toEqual(2)

    await rootIndexer.doTick(2)
    await rootIndexer.finishTick(2)

    expect(repository.getSliceData('token-a').get(2)).toEqual(4)
    expect(repository.getSliceData('token-b').get(2)).toEqual(4)
    expect(repository.getSliceData('token-c').get(2)).toEqual(4)
  })
  it('syncs new token after restart', async () => {
    const repository = testRepositoryFactory()

    const rootIndexer = new TestRootIndexer(0)
    const sliceIndexer = new TestSliceIndexer(
      ['token-a', 'token-b', 'token-c'],
      repository,
      [rootIndexer],
    )

    await rootIndexer.start()
    await sliceIndexer.start()

    await sliceIndexer.finishInvalidate(0)
    await rootIndexer.doTick(1)
    await rootIndexer.finishTick(1)

    expect(repository.getSliceData('token-a').get(1)).toEqual(2)
    expect(repository.getSliceData('token-b').get(1)).toEqual(2)
    expect(repository.getSliceData('token-c').get(1)).toEqual(2)

    // creating new instances to simulate restart
    const newRootIndexer = new TestRootIndexer(1)
    const newSliceIndexer = new TestSliceIndexer(
      ['token-a', 'token-b', 'token-c', 'token-d'],
      repository,
      [newRootIndexer],
    )

    await newRootIndexer.start()
    await newSliceIndexer.start()

    await newSliceIndexer.finishInvalidate(0)

    expect(repository.getSliceData('token-d').get(1)).toEqual(2)
  })
  it('drops old token after restart', async () => {
    const repository = testRepositoryFactory()

    const rootIndexer = new TestRootIndexer(0)
    const sliceIndexer = new TestSliceIndexer(
      ['token-a', 'token-b', 'token-c'],
      repository,
      [rootIndexer],
    )

    await rootIndexer.start()
    await sliceIndexer.start()

    await sliceIndexer.finishInvalidate(0)
    await rootIndexer.doTick(1)
    await rootIndexer.finishTick(1)

    expect(repository.getSliceData('token-a').get(1)).toEqual(2)
    expect(repository.getSliceData('token-b').get(1)).toEqual(2)
    expect(repository.getSliceData('token-c').get(1)).toEqual(2)

    // creating new instances to simulate restart
    const newRootIndexer = new TestRootIndexer(1)
    const newSliceIndexer = new TestSliceIndexer(
      ['token-a', 'token-b'],
      repository,
      [newRootIndexer],
    )

    await newRootIndexer.start()
    await newSliceIndexer.start()

    await newSliceIndexer.finishInvalidate(0)

    expect(repository.removeSlices).toHaveBeenCalledWith(['token-c'])
    expect(repository.getSliceData('token-c').get(1)).toBeNullish()
  })
})
describe(diffSlices.name, () => {
  describe('height increase', () => {
    it('marks token-a to update', () => {
      const expectedSlices: SliceHash[] = ['token-a', 'token-b', 'token-c']
      const actualSlices: SliceState[] = [
        { sliceHash: 'token-a', height: 100 },
        { sliceHash: 'token-b', height: 200 },
        { sliceHash: 'token-c', height: 300 },
      ]
      const from = 100
      const to = 200

      const { toRemove, toUpdate } = diffSlices(
        expectedSlices,
        actualSlices,
        from,
        to,
      )

      expect(toRemove).toEqual([])
      expect(toUpdate).toEqual([{ sliceHash: 'token-a', from, to }])
    })
  })
  describe('height decrease', () => {
    it('marks token-a to update', () => {
      const expectedSlices: SliceHash[] = ['token-a', 'token-b', 'token-c']
      const actualSlices: SliceState[] = [
        { sliceHash: 'token-a', height: 100 },
        { sliceHash: 'token-b', height: 200 },
        { sliceHash: 'token-c', height: 300 },
      ]
      const from = 300
      const to = 200

      const { toUpdate, toRemove } = diffSlices(
        expectedSlices,
        actualSlices,
        from,
        to,
      )

      expect(toRemove).toEqual([])
      expect(toUpdate).toEqual([{ sliceHash: 'token-a', from, to }])
    })
  })

  describe('configuration change', () => {
    it('marks token-b to removal from slices state', () => {
      const expectedSlices: SliceHash[] = ['token-a', 'token-c']
      const actualSlices: SliceState[] = [
        { sliceHash: 'token-a', height: 100 },
        { sliceHash: 'token-b', height: 200 },
        { sliceHash: 'token-c', height: 300 },
      ]
      const from = 100
      const to = 200

      const { toUpdate, toRemove } = diffSlices(
        expectedSlices,
        actualSlices,
        from,
        to,
      )

      expect(toRemove).toEqual(['token-b'])
      expect(toUpdate).toEqual([{ sliceHash: 'token-a', from, to }])
    })

    it('marks token-d to addition to slices state', () => {
      const expectedSlices: SliceHash[] = [
        'token-a',
        'token-b',
        'token-c',
        'token-d',
      ]

      const actualSlices: SliceState[] = [
        { sliceHash: 'token-a', height: 200 },
        { sliceHash: 'token-b', height: 200 },
        { sliceHash: 'token-c', height: 200 },
      ]

      const from = 100
      const to = 200

      const { toUpdate, toRemove } = diffSlices(
        expectedSlices,
        actualSlices,
        from,
        to,
      )

      expect(toRemove).toEqual([])
      expect(toUpdate).toEqual([{ sliceHash: 'token-d', from: 100, to: 200 }])
    })
  })
})

function testRepositoryFactory() {
  const sliceHeights = new Map<string, number>()
  const sliceData = new Map<string, Map<number, number>>()
  let safeHeight = 0

  return {
    getSliceHeights: mockFn(() => sliceHeights),
    getSliceData: mockFn(
      (hash: string) => sliceData.get(hash) ?? new Map<number, number>(),
    ),
    removeSlices: mockFn((hashes: string[]) => {
      for (const hash of hashes) {
        sliceHeights.delete(hash)
        sliceData.delete(hash)
      }
    }),
    setSliceHeight: mockFn((hash: string, height: number) => {
      sliceHeights.set(hash, height)
    }),
    setSliceData: mockFn((hash: string, data: Map<number, number>) => {
      sliceData.set(hash, data)
    }),
    getSafeHeight: mockFn(() => {
      return safeHeight
    }),
    setSafeHeight: mockFn((height: number) => {
      safeHeight = height
    }),
  }
}

class TestSliceIndexer extends SliceIndexer {
  public resolveInvalidate: (to: number) => void = () => {}
  public rejectInvalidate: (error: unknown) => void = () => {}

  public dispatchCounter = 0

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
    private readonly slices: string[],
    private readonly repository: ReturnType<typeof testRepositoryFactory>,
    parents: BaseIndexer[],
    name?: string,
    retryStrategy?: {
      invalidateRetryStrategy?: RetryStrategy
      updateRetryStrategy?: RetryStrategy
    },
  ) {
    super(Logger.SILENT.tag(name), parents, retryStrategy ?? {})

    const oldDispatch = Reflect.get(this, 'dispatch')
    Reflect.set(this, 'dispatch', (action: IndexerAction) => {
      oldDispatch.call(this, action)
      this.dispatchCounter++
    })
  }

  override getMainSafeHeight(): Promise<number> {
    return Promise.resolve(this.repository.getSafeHeight())
  }

  override setMainSafeHeight(safeHeight: number): Promise<void> {
    this.repository.setSafeHeight(safeHeight)
    return Promise.resolve()
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

  getExpectedSlices(): string[] {
    return this.slices
  }

  getSliceStates(): Promise<SliceState[]> {
    const sliceHeights = this.repository.getSliceHeights()
    const states = [...sliceHeights.entries()].map(
      ([slice, height]): SliceState => ({
        sliceHash: slice,
        height,
      }),
    )
    return Promise.resolve(states)
  }

  removeSlices(hashes: string[]): Promise<void> {
    this.repository.removeSlices(hashes)
    return Promise.resolve()
  }

  async updateSlices(updates: SliceUpdate[]): Promise<number> {
    let minHeight = Infinity
    for (const update of updates) {
      const sliceData = this.repository.getSliceData(update.sliceHash)

      for (let i = update.from; i <= update.to; i++) {
        sliceData.set(i, i * 2)
      }
      if (update.to < minHeight) {
        minHeight = update.to
      }

      this.repository.setSliceData(update.sliceHash, sliceData)
      this.repository.setSliceHeight(update.sliceHash, update.to)
    }
    return Promise.resolve(minHeight)
  }
}
