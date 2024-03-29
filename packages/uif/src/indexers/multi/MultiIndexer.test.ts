import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'

import { MultiIndexer } from './MultiIndexer'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
} from './types'

describe(MultiIndexer.name, () => {
  describe(MultiIndexer.prototype.initialize.name, () => {
    it('calls multiInitialize and saves configurations', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 400), actual('b', 200, 500)],
        [
          saved('a', 100, 400, 300),
          saved('b', 200, 500, 300),
          saved('c', 100, 300, 300),
        ],
      )

      const newHeight = await testIndexer.initialize()
      expect(newHeight).toEqual(300)

      expect(testIndexer.removeData).toHaveBeenOnlyCalledWith([
        removal('c', 100, 300),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenOnlyCalledWith([
        saved('a', 100, 400, 300),
        saved('b', 200, 500, 300),
      ])
    })

    it('skips calling removeData if there is nothing to remove', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 400), actual('b', 200, 500)],
        [saved('a', 100, 400, 400), saved('b', 200, 500, 500)],
      )

      const newHeight = await testIndexer.initialize()
      expect(newHeight).toEqual(Infinity)

      expect(testIndexer.removeData).not.toHaveBeenCalled()
      expect(testIndexer.saveConfigurations).toHaveBeenCalledWith([
        saved('a', 100, 400, 400),
        saved('b', 200, 500, 500),
      ])
    })

    it('no synced data', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 400), actual('b', 200, null)],
        [],
      )

      const newHeight = await testIndexer.initialize()
      expect(newHeight).toEqual(99)

      expect(testIndexer.removeData).not.toHaveBeenCalled()
      expect(testIndexer.saveConfigurations).toHaveBeenCalledWith([
        saved('a', 100, 400, null),
        saved('b', 200, null, null),
      ])
    })

    it('mismatched min and max times', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 500), actual('b', 200, 400), actual('c', 300, null)],
        [
          saved('a', 100, 400, 300),
          saved('b', 100, 300, 300),
          saved('c', 300, 400, 300),
        ],
      )

      const newHeight = await testIndexer.initialize()
      expect(newHeight).toEqual(300)

      expect(testIndexer.removeData).toHaveBeenCalledWith([
        removal('b', 100, 199),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenCalledWith([
        saved('a', 100, 500, 300),
        saved('b', 200, 400, 300),
        saved('c', 300, null, 300),
      ])
    })
  })

  describe(MultiIndexer.prototype.update.name, () => {
    it('calls multiUpdate with an early matching configuration', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 300, 400)],
        [],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(100, 500)

      expect(newHeight).toEqual(200)
      expect(testIndexer.multiUpdate).toHaveBeenOnlyCalledWith(100, 200, [
        update('a', 100, 200, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 200, 200),
        saved('b', 300, 400, null),
      ])
    })

    it('calls multiUpdate with a late matching configuration', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 300, 400)],
        [saved('a', 100, 200, 200)],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(300, 500)

      expect(newHeight).toEqual(400)
      expect(testIndexer.multiUpdate).toHaveBeenOnlyCalledWith(300, 400, [
        update('b', 300, 400, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 200, 200),
        saved('b', 300, 400, 400),
      ])
    })

    it('calls multiUpdate with two matching configurations', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 100, 400)],
        [],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(100, 500)

      expect(newHeight).toEqual(200)
      expect(testIndexer.multiUpdate).toHaveBeenOnlyCalledWith(100, 200, [
        update('a', 100, 200, false),
        update('b', 100, 400, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 200, 200),
        saved('b', 100, 400, 200),
      ])
    })

    it('calls multiUpdate with two middle matching configurations', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 400), actual('b', 200, 500)],
        [saved('a', 100, 400, 300), saved('b', 200, 500, 300)],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(301, 600)

      expect(newHeight).toEqual(400)
      expect(testIndexer.multiUpdate).toHaveBeenOnlyCalledWith(301, 400, [
        update('a', 100, 400, false),
        update('b', 200, 500, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 400, 400),
        saved('b', 200, 500, 400),
      ])
    })

    it('skips calling multiUpdate if we are too early', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 300, 400)],
        [],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(0, 500)

      expect(newHeight).toEqual(99)
      expect(testIndexer.multiUpdate).not.toHaveBeenCalled()
      expect(testIndexer.saveConfigurations).toHaveBeenCalledTimes(1)
    })

    it('skips calling multiUpdate if we are too late', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 300, 400)],
        [],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(401, 500)

      expect(newHeight).toEqual(500)
      expect(testIndexer.multiUpdate).not.toHaveBeenCalled()
      expect(testIndexer.saveConfigurations).toHaveBeenCalledTimes(1)
    })

    it('skips calling multiUpdate between configs', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 300, 400)],
        [],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(201, 500)

      expect(newHeight).toEqual(299)
      expect(testIndexer.multiUpdate).not.toHaveBeenCalled()
      expect(testIndexer.saveConfigurations).toHaveBeenCalledTimes(1)
    })

    it('calls multiUpdate with a matching configuration with data', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 100, 400)],
        [saved('a', 100, 200, 200)],
      )
      await testIndexer.initialize()

      const newHeight = await testIndexer.update(100, 500)

      expect(newHeight).toEqual(200)
      expect(testIndexer.multiUpdate).toHaveBeenOnlyCalledWith(100, 200, [
        update('a', 100, 200, true),
        update('b', 100, 400, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 200, 200),
        saved('b', 100, 400, 200),
      ])
    })

    it('multiple update calls', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 100, 400)],
        [saved('a', 100, 200, 200)],
      )
      await testIndexer.initialize()

      expect(await testIndexer.update(100, 500)).toEqual(200)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 200, [
        update('a', 100, 200, true),
        update('b', 100, 400, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 200, 200),
        saved('b', 100, 400, 200),
      ])

      // The same range. In real life might be a result of a parent reorg
      // Invalidate is a no-op so we don't need to call it
      expect(await testIndexer.update(100, 500)).toEqual(200)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(2, 100, 200, [
        update('a', 100, 200, true),
        update('b', 100, 400, true),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(3, [
        saved('a', 100, 200, 200),
        saved('b', 100, 400, 200),
      ])

      // Next range
      expect(await testIndexer.update(201, 500)).toEqual(400)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(3, 201, 400, [
        update('b', 100, 400, false),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(4, [
        saved('a', 100, 200, 200),
        saved('b', 100, 400, 400),
      ])
    })

    it('correctly updates currentHeight in saved configurations', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 500), actual('b', 100, 500), actual('c', 100, 500)],
        [
          saved('a', 100, 500, null),
          saved('b', 100, 500, 250),
          saved('c', 100, 500, 500),
        ],
      )
      expect(await testIndexer.initialize()).toEqual(99)

      expect(await testIndexer.update(100, 500)).toEqual(250)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 250, [
        update('a', 100, 500, false),
        update('b', 100, 500, true),
        update('c', 100, 500, true),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 500, 250),
        saved('b', 100, 500, 250),
        saved('c', 100, 500, 500),
      ])

      expect(await testIndexer.update(251, 500)).toEqual(500)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(2, 251, 500, [
        update('a', 100, 500, false),
        update('b', 100, 500, false),
        update('c', 100, 500, true),
      ])
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(3, [
        saved('a', 100, 500, 500),
        saved('b', 100, 500, 500),
        saved('c', 100, 500, 500),
      ])
    })

    it('gets configurations from different source', async () => {
      const testIndexer = new TestMultiIndexer(undefined, [])
      testIndexer.getInitialConfigurations = () => [
        actual('a', 100, null),
        actual('b', 100, null),
      ]

      const newHeight = await testIndexer.initialize()
      expect(newHeight).toEqual(99)
    })
  })

  describe('multiUpdate', () => {
    it('returns the currentHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, 200), saved('b', 100, 400, 200)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(200)

      const newHeight = await testIndexer.update(200, 500)
      expect(newHeight).toEqual(200)
      expect(testIndexer.saveConfigurations).toHaveBeenCalledTimes(1)
    })

    it('returns the targetHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, 200), saved('b', 100, 400, 200)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(300)

      const newHeight = await testIndexer.update(200, 300)
      expect(newHeight).toEqual(300)
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 300, 300),
        saved('b', 100, 400, 300),
      ])
    })

    it('returns something in between', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, 200), saved('b', 100, 400, 200)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(250)

      const newHeight = await testIndexer.update(200, 300)
      expect(newHeight).toEqual(250)
      expect(testIndexer.saveConfigurations).toHaveBeenNthCalledWith(2, [
        saved('a', 100, 300, 250),
        saved('b', 100, 400, 250),
      ])
    })

    it('cannot return less than currentHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, 200), saved('b', 100, 400, 200)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(150)

      await expect(testIndexer.update(200, 300)).toBeRejectedWith(
        /returned height must be between from and to/,
      )
    })

    it('cannot return more than targetHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, 200), saved('b', 100, 400, 200)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(350)

      await expect(testIndexer.update(200, 300)).toBeRejectedWith(
        /returned height must be between from and to/,
      )
    })
  })
})

class TestMultiIndexer extends MultiIndexer<null> {
  constructor(
    configurations: Configuration<null>[] | undefined,
    private readonly _saved: SavedConfiguration<null>[],
  ) {
    super(Logger.SILENT, [], configurations)
  }

  override multiInitialize(): Promise<SavedConfiguration<null>[]> {
    return Promise.resolve(this._saved)
  }

  multiUpdate = mockFn<MultiIndexer<null>['multiUpdate']>((_, targetHeight) =>
    Promise.resolve(targetHeight),
  )

  removeData = mockFn<MultiIndexer<null>['removeData']>().resolvesTo(undefined)

  saveConfigurations =
    mockFn<MultiIndexer<null>['saveConfigurations']>().resolvesTo(undefined)
}

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<null> {
  return { id, properties: null, minHeight, maxHeight }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): SavedConfiguration<null> {
  return { id, properties: null, minHeight, maxHeight, currentHeight }
}

function update(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  hasData: boolean,
): UpdateConfiguration<null> {
  return { id, properties: null, minHeight, maxHeight, hasData }
}

function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration<null> {
  return { id, properties: null, from, to }
}
