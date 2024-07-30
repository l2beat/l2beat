import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { describeDatabase, mockDatabase } from '../../../test/database'
import { IndexerService } from '../IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../ids'
import { ManagedMultiIndexer } from './ManagedMultiIndexer'
import { MultiIndexer } from './MultiIndexer'
import {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

const common = {
  name: 'indexer',
  parents: [],
  configurations: [mockObject<Configuration<null>>({ id: 'a' })],
  indexerService: mockObject<IndexerService>(),
  logger: Logger.SILENT,
  serializeConfiguration: (v: null) => JSON.stringify(v),
  db: mockDatabase(),
}

describe(ManagedMultiIndexer.name, () => {
  afterEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('throws on empty configurations', () => {
      expect(() => {
        new TestIndexer({ ...common, configurations: [] })
      }).toThrow('Configurations should not be empty')
    })

    it('throws on duplicate indexer ids', () => {
      new TestIndexer({ ...common, name: 'same-name' })
      expect(() => {
        new TestIndexer({ ...common, name: 'same-name' })
      }).toThrow('Indexer id same-name is duplicated!')
    })

    it('throws on duplicate configuration ids', () => {
      new TestIndexer({
        ...common,
        configurations: [mockObject<Configuration<null>>({ id: 'a' })],
      })
      expect(() => {
        new TestIndexer({
          ...common,
          name: 'other-name',
          configurations: [mockObject<Configuration<null>>({ id: 'a' })],
        })
      }).toThrow('Configuration id a is duplicated!')
    })
  })

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
      expect(newHeight).toEqual({ safeHeight: 300 })

      expect(testIndexer.removeData).toHaveBeenOnlyCalledWith([
        removal('c', 100, 300),
      ])
      expect(testIndexer.updateConfigurationsState).toHaveBeenOnlyCalledWith([
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
      expect(newHeight).toEqual({ safeHeight: Infinity })

      expect(testIndexer.removeData).not.toHaveBeenCalled()
      expect(testIndexer.updateConfigurationsState).toHaveBeenCalledWith([
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
      expect(newHeight).toEqual({ safeHeight: 99 })

      expect(testIndexer.removeData).not.toHaveBeenCalled()
      expect(testIndexer.updateConfigurationsState).toHaveBeenCalledWith([
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
      expect(newHeight).toEqual({ safeHeight: 300 })

      expect(testIndexer.removeData).toHaveBeenCalledWith([
        removal('b', 100, 199),
      ])
      expect(testIndexer.updateConfigurationsState).toHaveBeenCalledWith([
        saved('a', 100, 500, 300),
        saved('b', 200, 400, 300),
        saved('c', 300, null, 300),
      ])
    })

    it('calls getters in order', async () => {
      const calls: string[] = []
      const testIndexer = new TestMultiIndexer([], [])
      testIndexer.multiInitialize = mockFn(async () => {
        calls.push('multiInitialize')
        return []
      })

      await testIndexer.initialize()

      expect(calls).toEqual(['multiInitialize'])
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
        actual('a', 100, 200),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(200)
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
        actual('b', 300, 400),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(400)
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
        actual('a', 100, 200),
        actual('b', 100, 400),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(200)
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
        actual('a', 100, 400),
        actual('b', 200, 500),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(400)
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
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenCalledTimes(0)
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
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenCalledTimes(0)
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
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenCalledTimes(0)
    })

    it('multiple update calls', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 200), actual('b', 100, 400)],
        [saved('a', 100, 200, 200)],
      )
      await testIndexer.initialize()

      expect(await testIndexer.update(100, 500)).toEqual(200)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 200, [
        actual('b', 100, 400),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(200)

      // TODO: what was the idea behind this test?
      // The same range. In real life might be a result of a parent reorg
      // Invalidate is a no-op so we don't need to call it
      // expect(await testIndexer.update(100, 500)).toEqual(200)
      // expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(
      //   2,
      //   100,
      //   200,
      //   [actual('a', 100, 200), actual('b', 100, 400)],
      //   ,
      // )
      // expect(
      //   testIndexer.updateConfigurationsCurrentHeight,
      // ).toHaveBeenCalledTimes(1)

      // Next range
      expect(await testIndexer.update(201, 500)).toEqual(400)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(2, 201, 400, [
        actual('b', 100, 400),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenNthCalledWith(2, 400)
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
      expect(await testIndexer.initialize()).toEqual({ safeHeight: 99 })

      expect(await testIndexer.update(100, 500)).toEqual(250)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 250, [
        actual('a', 100, 500),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(250)

      expect(await testIndexer.update(251, 500)).toEqual(500)
      expect(testIndexer.multiUpdate).toHaveBeenNthCalledWith(2, 251, 500, [
        actual('a', 100, 500),
        actual('b', 100, 500),
      ])
      expect(
        testIndexer.updateConfigurationsCurrentHeight,
      ).toHaveBeenNthCalledWith(2, 500)
    })
  })

  describe('multiUpdate', () => {
    it('returns the currentHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, 200), saved('b', 100, 400, 200)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(200))

      const newHeight = await testIndexer.update(200, 500)
      expect(newHeight).toEqual(200)
      expect(testIndexer.updateConfigurationsState).toHaveBeenCalledTimes(1)
    })

    it('returns the targetHeight', async () => {
      const testIndexer = new TestMultiIndexer([], [])
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(200))

      const newHeight = await testIndexer.update(201, 300)
      expect(newHeight).toEqual(300)
    })

    it('returns something in between', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, null), saved('b', 100, 400, null)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(250))

      const newHeight = await testIndexer.update(201, 300)
      expect(newHeight).toEqual(250)
      expect(testIndexer.updateConfigurationsState).toHaveBeenOnlyCalledWith([
        saved('a', 100, 300, 250),
        saved('b', 100, 400, 250),
      ])
    })

    it('cannot return less than currentHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, null), saved('b', 100, 400, null)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(150))

      await expect(testIndexer.update(200, 300)).toBeRejectedWith(
        /returned height must be between from and to/,
      )
    })

    it('cannot return more than targetHeight', async () => {
      const testIndexer = new TestMultiIndexer(
        [actual('a', 100, 300), actual('b', 100, 400)],
        [saved('a', 100, 300, null), saved('b', 100, 400, null)],
      )
      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(350))

      await expect(testIndexer.update(200, 300)).toBeRejectedWith(
        /returned height must be between from and to/,
      )
    })
  })

  it(ManagedMultiIndexer.prototype.setSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      setSafeHeight: async () => {},
    })
    const indexer = await initializeMockIndexer(indexerService, [], [])

    await indexer.setSafeHeight(1)

    expect(indexerService.setSafeHeight).toHaveBeenOnlyCalledWith('indexer', 1)
  })

  it(ManagedMultiIndexer.prototype.multiInitialize.name, async () => {
    const configurations = [saved('a', 100, null, null)]
    const indexerService = mockObject<IndexerService>({
      getSavedConfigurations: mockFn().resolvesTo(configurations),
    })

    const indexer = await initializeMockIndexer(indexerService, [], [])

    const result = await indexer.multiInitialize()

    expect(result).toEqual(
      configurations.map((c) => ({
        ...c,
        properties: JSON.stringify(c.properties),
      })),
    )
    expect(indexerService.getSavedConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(ManagedMultiIndexer.prototype.updateConfigurationsState.name, async () => {
    const configurations = [saved('a', 100, null, null)]

    const indexerService = mockObject<IndexerService>({
      upsertConfigurations: async () => {},
      updateConfigurationsCurrentHeight: async () => {},
      deleteConfigurations: async () => {},
    })

    const indexer = await initializeMockIndexer(indexerService, [], [])

    await indexer.updateConfigurationsState(configurations)

    expect(indexerService.upsertConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
      configurations,
      expect.anything(),
    )
    expect(indexerService.deleteConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
      configurations.map((c) => c.id),
    )
  })

  it(
    ManagedMultiIndexer.prototype.updateConfigurationsCurrentHeight.name,
    async () => {
      const indexerService = mockObject<IndexerService>({
        upsertConfigurations: async () => {},
        updateConfigurationsCurrentHeight: async () => {},
        deleteConfigurations: async () => {},
      })

      const indexer = await initializeMockIndexer(indexerService, [], [])

      await indexer.updateConfigurationsCurrentHeight(1)

      expect(
        indexerService.updateConfigurationsCurrentHeight,
      ).toHaveBeenNthCalledWith(1, 'indexer', 1)
    },
  )

  describeDatabase('e2e', (db) => {
    const indexerService = new IndexerService(db)
    afterEach(async () => {
      _TEST_ONLY_resetUniqueIds()
      await db.indexerState.deleteAll()
      await db.indexerConfiguration.deleteAll()
    })

    it('update', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [
          actual('a', 100, 300),
          actual('b', 200, 500),
          actual('c', 400, null),
          actual('d', 100, null),
        ],
        db,
      )
      await indexer.start()

      const target = 600
      let current = 99
      // This "+1" logic mimics Indexer.executeUpdate
      while (current + 1 < target) {
        current = await indexer.update(current + 1, target)
      }

      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 199, [
        actual('a', 100, 300),
      ])
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(2, 200, 300, [
        actual('a', 100, 300),
        actual('b', 200, 500),
      ])
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(3, 301, 399, [
        actual('b', 200, 500),
      ])
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(4, 400, 500, [
        actual('b', 200, 500),
        actual('c', 400, null),
      ])
      expect(indexer.multiUpdate).toHaveBeenLastCalledWith(551, 600, [
        actual('c', 400, null),
        actual('d', 100, null),
      ])

      const configurations = await getSavedConfigurations(indexerService)

      expect(configurations).toEqualUnsorted(
        [
          saved('a', 100, 300, 300),
          saved('b', 200, 500, 500),
          saved('c', 400, null, 600),
          saved('d', 100, null, 600),
        ].map((c) => ({
          ...c,
          properties: JSON.stringify(c),
        })),
      )
    })

    it('configuration removed', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [],
      )
      await indexer.start()

      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 550),
      ])
    })

    it('minHeight changed', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 50, null)],
      )
      await indexer.start()

      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 550),
      ])
    })

    it('maxHeight changed', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 100, 200)],
      )
      await indexer.start()

      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 201, 550),
      ])
    })

    it('properties changed', async () => {
      const savedConfigurations = [
        { ...saved('a', 100, null, 500), properties: { prop: 'a' } },
        { ...saved('b', 100, null, 500), properties: { prop: 'b' } },
      ]
      await indexerService.upsertConfigurations(
        'indexer',
        savedConfigurations,
        (v) => JSON.stringify(v),
      )

      const configurations = [
        { ...actual('a', 100, null), properties: { prop: 'aa' } },
        { ...actual('b', 100, null), properties: { prop: 'b' } },
      ]

      class TestIndexer2<T> extends ManagedMultiIndexer<T> {
        constructor(override readonly options: ManagedMultiIndexerOptions<T>) {
          super(options)
        }
        multiUpdate = mockFn<MultiIndexer<T>['multiUpdate']>(
          async (_, targetHeight) => () => Promise.resolve(targetHeight),
        )
        removeData =
          mockFn<ManagedMultiIndexer<T>['removeData']>().resolvesTo(undefined)

        override updateConfigurationsState =
          mockFn<
            ManagedMultiIndexer<T>['updateConfigurationsState']
          >().resolvesTo(undefined)
      }

      const indexer = new TestIndexer2<{ prop: string }>({
        parents: [],
        name: 'indexer',
        indexerService,
        configurations,
        logger: Logger.SILENT,
        serializeConfiguration: (v) => JSON.stringify(v),
        db: mockDatabase(),
      })

      await indexer.start()

      expect(indexer.updateConfigurationsState).toHaveBeenOnlyCalledWith({
        toAdd: [],
        toUpdate: [
          {
            ...saved('a', 100, null, 500),
            properties: { prop: 'aa' },
          },
        ],
        toDelete: [],
        toTrim: [],
      })
    })
  })
})

class TestIndexer extends ManagedMultiIndexer<null> {
  constructor(override readonly options: ManagedMultiIndexerOptions<null>) {
    super(options)
  }
  multiUpdate = mockFn<MultiIndexer<null>['multiUpdate']>(
    async (_, targetHeight) => () => Promise.resolve(targetHeight),
  )
  removeData =
    mockFn<ManagedMultiIndexer<null>['removeData']>().resolvesTo(undefined)
}

async function getSavedConfigurations(indexerService: IndexerService) {
  return await indexerService.getSavedConfigurations('indexer')
}

async function initializeMockIndexer(
  indexerService: IndexerService,
  saved: SavedConfiguration<null>[],
  configurations: Configuration<null>[],
  database?: Database,
) {
  if (saved.length > 0) {
    await indexerService.upsertConfigurations('indexer', saved, (v) =>
      JSON.stringify(v),
    )
  }
  const indexer = new TestIndexer({
    parents: [],
    name: 'indexer',
    indexerService,
    configurations,
    logger: Logger.SILENT,
    serializeConfiguration: (v) => JSON.stringify(v),
    db: database ?? mockDatabase(),
  })
  return indexer
}

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<null> {
  return { id: id.repeat(12), properties: null, minHeight, maxHeight }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): SavedConfiguration<null> {
  return {
    id: id.repeat(12),
    properties: null,
    minHeight,
    maxHeight,
    currentHeight,
  }
}

function removal(id: string, from: number, to: number): RemovalConfiguration {
  return { id: id.repeat(12), from, to }
}
