import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { IndexerService } from '../IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../ids'
import { ManagedMultiIndexer } from './ManagedMultiIndexer'
import {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

const INDEXER_ID = 'indexer'
const SERIALIZE = (v: unknown) => JSON.stringify(v)
const common = {
  name: INDEXER_ID,
  parents: [],
  configurations: [actual('a', 100, null)],
  indexerService: mockObject<IndexerService>({
    getSavedConfigurations: async () => [saved('a', 100, null, null)],
  }),
  logger: Logger.SILENT,
  serializeConfiguration: SERIALIZE,
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
        configurations: [mockObject<Configuration<string>>({ id: 'a' })],
      })
      expect(() => {
        new TestIndexer({
          ...common,
          name: 'other-name',
          configurations: [mockObject<Configuration<string>>({ id: 'a' })],
        })
      }).toThrow('Configuration id a is duplicated!')
    })
  })

  describe(ManagedMultiIndexer.prototype.initialize.name, () => {
    it('gets previous state and returns safeHeight based on configurations', async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [saved('a', 100, null, 1000)],
        insertConfigurations: async () => {},
      })

      const testIndexer = new TestIndexer({
        ...common,
        indexerService,
        configurations: [actual('a', 100, null), actual('b', 100, null)],
      })

      const newHeight = await testIndexer.initialize()

      expect(indexerService.getSavedConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
      )
      expect(indexerService.insertConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        [actual('b', 100, null)],
        SERIALIZE,
      )
      expect(newHeight).toEqual({ safeHeight: 99 })
    })
  })

  describe(ManagedMultiIndexer.prototype.updateConfigurationsState.name, () => {
    it('adds, updates, deletes and trims', async () => {
      const indexerService = mockObject<IndexerService>({
        insertConfigurations: async () => {},
        upsertConfigurations: async () => {},
        deleteConfigurations: async () => {},
      })
      const testIndexer = new TestIndexer({ ...common, indexerService })

      await testIndexer.updateConfigurationsState({
        toAdd: [actual('a', 100, null)],
        toUpdate: [saved('b', 100, 1000, 1000, 'props')],
        toDelete: ['c', 'd'],
        toTrim: [removal('b', 50, 99), removal('b', 1001, 1500)],
      })

      expect(indexerService.insertConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        [actual('a', 100, null)],
        SERIALIZE,
      )
      expect(indexerService.upsertConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        [saved('b', 100, 1000, 1000, 'props')],
        SERIALIZE,
      )
      expect(indexerService.deleteConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        ['c', 'd'],
      )
      expect(testIndexer.removeData).toHaveBeenOnlyCalledWith([
        removal('b', 50, 99),
        removal('b', 1001, 1500),
      ])
    })
  })

  describe(ManagedMultiIndexer.prototype.update.name, () => {
    it('skips if range is empty, returns correct to', async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [saved('a', 100, null, null)],
      })

      const testIndexer = new TestIndexer({
        ...common,
        indexerService,
        configurations: [actual('a', 100, null)],
      })
      await testIndexer.initialize()

      // Configuration starts at 100, this range will be empty
      const newHeight = await testIndexer.update(0, 50)

      expect(testIndexer.multiUpdate).not.toHaveBeenCalled()
      expect(newHeight).toEqual(50)
    })

    it('gets configurations from range, updates and saves the state', async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [
          saved('a', 100, null, 1000),
          saved('b', 100, null, 1000),
        ],
        updateConfigurationsCurrentHeight: async () => {},
      })

      const db = mockObject<Database>({
        transaction: async (fun) => await fun(),
      })

      const testIndexer = new TestIndexer({
        ...common,
        db,
        indexerService,
        configurations: [actual('a', 100, null), actual('b', 100, null)],
      })
      const saveData = mockFn((targetHeight) => Promise.resolve(targetHeight))
      testIndexer.multiUpdate = mockFn<
        ManagedMultiIndexer<string>['multiUpdate']
      >(async (_, targetHeight) => () => saveData(targetHeight))

      await testIndexer.initialize()
      const newHeight = await testIndexer.update(1001, 1100)

      expect(testIndexer.multiUpdate).toHaveBeenOnlyCalledWith(1001, 1100, [
        actual('a', 100, null),
        actual('b', 100, null),
      ])

      expect(db.transaction).toHaveBeenCalledTimes(1)
      expect(saveData).toHaveBeenCalledTimes(1)
      expect(
        indexerService.updateConfigurationsCurrentHeight,
      ).toHaveBeenOnlyCalledWith(INDEXER_ID, 1100)

      expect(newHeight).toEqual(1100)
    })

    it('cannot return more than currentHeight', async () => {
      const testIndexer = new TestIndexer({
        ...common,
      })

      await testIndexer.initialize()

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(50))
      await expect(testIndexer.update(100, 500)).toBeRejectedWith(
        /Returned height must be between from and to/,
      )

      testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(50_000))
      await expect(testIndexer.update(100, 500)).toBeRejectedWith(
        /Returned height must be between from and to/,
      )
    })

    //   it('cannot return more than targetHeight', async () => {
    //     const testIndexer = new TestIndexer(
    //       [actual('a', 100, 300), actual('b', 100, 400)],
    //       [saved('a', 100, 300, null), saved('b', 100, 400, null)],
    //     )
    //     await testIndexer.initialize()

    //     testIndexer.multiUpdate.resolvesTo(() => Promise.resolve(350))

    //     await expect(testIndexer.update(200, 300)).toBeRejectedWith(
    //       /returned height must be between from and to/,
    //     )
    //   })
  })

  describe(ManagedMultiIndexer.prototype.findRange.name, () => {
    let testIndexer: ManagedMultiIndexer<string>

    beforeEach(async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [saved('a', 100, 200, null)],
      })
      testIndexer = new TestIndexer({
        ...common,
        indexerService,
        configurations: [actual('a', 100, 200)],
      })
      await testIndexer.initialize()
    })

    it('finds range correctly for a value before the start', () => {
      const fromBeforeStart = 10
      expect(testIndexer.findRange(fromBeforeStart)).toEqual({
        from: -Infinity,
        to: 99,
        configurations: [],
      })
    })

    it('finds range correctly for a value at the start', () => {
      const fromAtStart = 100
      expect(testIndexer.findRange(fromAtStart)).toEqual({
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200)],
      })
    })

    it('finds range correctly for a value between start and end', () => {
      const fromBetween = 150
      expect(testIndexer.findRange(fromBetween)).toEqual({
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200)],
      })
    })

    it('finds range correctly for a value at the end', () => {
      const fromAtEnd = 200
      expect(testIndexer.findRange(fromAtEnd)).toEqual({
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200)],
      })
    })

    it('finds range correctly for a value after the end', () => {
      const fromAfterStart = 250
      expect(testIndexer.findRange(fromAfterStart)).toEqual({
        from: 201,
        to: Infinity,
        configurations: [],
      })
    })
  })

  describe(
    ManagedMultiIndexer.prototype.updateConfigurationsCurrentHeight.name,
    () => {
      it('calls indexer service', async () => {
        const indexerService = mockObject<IndexerService>({
          updateConfigurationsCurrentHeight: async () => {},
        })

        const testIndexer = new TestIndexer({ ...common, indexerService })

        await testIndexer.updateConfigurationsCurrentHeight(100)

        expect(
          indexerService.updateConfigurationsCurrentHeight,
        ).toHaveBeenOnlyCalledWith(INDEXER_ID, 100)
      })
    },
  )

  // it(ManagedMultiIndexer.prototype.setSafeHeight.name, async () => {
  //   const indexerService = mockObject<IndexerService>({
  //     setSafeHeight: async () => {},
  //   })
  //   const indexer = await initializeMockIndexer(indexerService, [], [])

  //   await indexer.setSafeHeight(1)

  //   expect(indexerService.setSafeHeight).toHaveBeenOnlyCalledWith('indexer', 1)
  // })

  // it(ManagedMultiIndexer.prototype.multiInitialize.name, async () => {
  //   const configurations = [saved('a', 100, null, null)]
  //   const indexerService = mockObject<IndexerService>({
  //     getSavedConfigurations: mockFn().resolvesTo(configurations),
  //   })

  //   const indexer = await initializeMockIndexer(indexerService, [], [])

  //   const result = await indexer.multiInitialize()

  //   expect(result).toEqual(
  //     configurations.map((c) => ({
  //       ...c,
  //       properties: JSON.stringify(c.properties),
  //     })),
  //   )
  //   expect(indexerService.getSavedConfigurations).toHaveBeenOnlyCalledWith(
  //     'indexer',
  //   )
  // })

  // it(ManagedMultiIndexer.prototype.updateConfigurationsState.name, async () => {
  //   const configurations = [saved('a', 100, null, null)]

  //   const indexerService = mockObject<IndexerService>({
  //     upsertConfigurations: async () => {},
  //     updateConfigurationsCurrentHeight: async () => {},
  //     deleteConfigurations: async () => {},
  //   })

  //   const indexer = await initializeMockIndexer(indexerService, [], [])

  //   await indexer.updateConfigurationsState(configurations)

  //   expect(indexerService.upsertConfigurations).toHaveBeenOnlyCalledWith(
  //     'indexer',
  //     configurations,
  //     expect.anything(),
  //   )
  //   expect(indexerService.deleteConfigurations).toHaveBeenOnlyCalledWith(
  //     'indexer',
  //     configurations.map((c) => c.id),
  //   )
  // })

  // it(
  //   ManagedMultiIndexer.prototype.updateConfigurationsCurrentHeight.name,
  //   async () => {
  //     const indexerService = mockObject<IndexerService>({
  //       upsertConfigurations: async () => {},
  //       updateConfigurationsCurrentHeight: async () => {},
  //       deleteConfigurations: async () => {},
  //     })

  //     const indexer = await initializeMockIndexer(indexerService, [], [])

  //     await indexer.updateConfigurationsCurrentHeight(1)

  //     expect(
  //       indexerService.updateConfigurationsCurrentHeight,
  //     ).toHaveBeenNthCalledWith(1, 'indexer', 1)
  //   },
  // )

  // describeDatabase('e2e', (db) => {
  //   const indexerService = new IndexerService(db)
  //   afterEach(async () => {
  //     _TEST_ONLY_resetUniqueIds()
  //     await db.indexerState.deleteAll()
  //     await db.indexerConfiguration.deleteAll()
  //   })

  //   it('update', async () => {
  //     const indexer = await initializeMockIndexer(
  //       indexerService,
  //       [saved('d', 100, null, 550)],
  //       [
  //         actual('a', 100, 300),
  //         actual('b', 200, 500),
  //         actual('c', 400, null),
  //         actual('d', 100, null),
  //       ],
  //       db,
  //     )
  //     await indexer.start()

  //     const target = 600
  //     let current = 99
  //     // This "+1" logic mimics Indexer.executeUpdate
  //     while (current + 1 < target) {
  //       current = await indexer.update(current + 1, target)
  //     }

  //     expect(indexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 199, [
  //       actual('a', 100, 300),
  //     ])
  //     expect(indexer.multiUpdate).toHaveBeenNthCalledWith(2, 200, 300, [
  //       actual('a', 100, 300),
  //       actual('b', 200, 500),
  //     ])
  //     expect(indexer.multiUpdate).toHaveBeenNthCalledWith(3, 301, 399, [
  //       actual('b', 200, 500),
  //     ])
  //     expect(indexer.multiUpdate).toHaveBeenNthCalledWith(4, 400, 500, [
  //       actual('b', 200, 500),
  //       actual('c', 400, null),
  //     ])
  //     expect(indexer.multiUpdate).toHaveBeenLastCalledWith(551, 600, [
  //       actual('c', 400, null),
  //       actual('d', 100, null),
  //     ])

  //     const configurations = await getSavedConfigurations(indexerService)

  //     expect(configurations).toEqualUnsorted(
  //       [
  //         saved('a', 100, 300, 300),
  //         saved('b', 200, 500, 500),
  //         saved('c', 400, null, 600),
  //         saved('d', 100, null, 600),
  //       ].map((c) => ({
  //         ...c,
  //         properties: JSON.stringify(c),
  //       })),
  //     )
  //   })

  //   it('configuration removed', async () => {
  //     const indexer = await initializeMockIndexer(
  //       indexerService,
  //       [saved('d', 100, null, 550)],
  //       [],
  //     )
  //     await indexer.start()

  //     expect(indexer.removeData).toHaveBeenOnlyCalledWith([
  //       removal('d', 100, 550),
  //     ])
  //   })

  //   it('minHeight changed', async () => {
  //     const indexer = await initializeMockIndexer(
  //       indexerService,
  //       [saved('d', 100, null, 550)],
  //       [actual('d', 50, null)],
  //     )
  //     await indexer.start()

  //     expect(indexer.removeData).toHaveBeenOnlyCalledWith([
  //       removal('d', 100, 550),
  //     ])
  //   })

  //   it('maxHeight changed', async () => {
  //     const indexer = await initializeMockIndexer(
  //       indexerService,
  //       [saved('d', 100, null, 550)],
  //       [actual('d', 100, 200)],
  //     )
  //     await indexer.start()

  //     expect(indexer.removeData).toHaveBeenOnlyCalledWith([
  //       removal('d', 201, 550),
  //     ])
  //   })

  //   it('properties changed', async () => {
  //     const savedConfigurations = [
  //       { ...saved('a', 100, null, 500), properties: { prop: 'a' } },
  //       { ...saved('b', 100, null, 500), properties: { prop: 'b' } },
  //     ]
  //     await indexerService.upsertConfigurations(
  //       'indexer',
  //       savedConfigurations,
  //       (v) => JSON.stringify(v),
  //     )

  //     const configurations = [
  //       { ...actual('a', 100, null), properties: { prop: 'aa' } },
  //       { ...actual('b', 100, null), properties: { prop: 'b' } },
  //     ]

  //     class TestIndexer2<T> extends ManagedMultiIndexer<T> {
  //       constructor(override readonly options: ManagedMultiIndexerOptions<T>) {
  //         super(options)
  //       }
  //       multiUpdate = mockFn<MultiIndexer<T>['multiUpdate']>(
  //         async (_, targetHeight) => () => Promise.resolve(targetHeight),
  //       )
  //       removeData =
  //         mockFn<ManagedMultiIndexer<T>['removeData']>().resolvesTo(undefined)

  //       override updateConfigurationsState =
  //         mockFn<
  //           ManagedMultiIndexer<T>['updateConfigurationsState']
  //         >().resolvesTo(undefined)
  //     }

  //     const indexer = new TestIndexer2<{ prop: string }>({
  //       parents: [],
  //       name: 'indexer',
  //       indexerService,
  //       configurations,
  //       logger: Logger.SILENT,
  //       serializeConfiguration: (v) => JSON.stringify(v),
  //       db: mockDatabase(),
  //     })

  //     await indexer.start()

  //     expect(indexer.updateConfigurationsState).toHaveBeenOnlyCalledWith({
  //       toAdd: [],
  //       toUpdate: [
  //         {
  //           ...saved('a', 100, null, 500),
  //           properties: { prop: 'aa' },
  //         },
  //       ],
  //       toDelete: [],
  //       toTrim: [],
  //     })
  //   })
  // })
})

class TestIndexer extends ManagedMultiIndexer<string> {
  constructor(override readonly options: ManagedMultiIndexerOptions<string>) {
    super(options)
  }
  multiUpdate = mockFn<ManagedMultiIndexer<string>['multiUpdate']>(
    async (_, targetHeight) => () => Promise.resolve(targetHeight),
  )
  removeData =
    mockFn<ManagedMultiIndexer<string>['removeData']>().resolvesTo(undefined)
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
  properties?: string,
): Configuration<string> {
  return {
    id: id.repeat(12),
    properties: properties ?? '',
    minHeight,
    maxHeight,
  }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
  properties?: string,
): SavedConfiguration<string> {
  return {
    id: id.repeat(12),
    properties: JSON.stringify(properties ?? ''),
    minHeight,
    maxHeight,
    currentHeight,
  }
}

function removal(id: string, from: number, to: number): RemovalConfiguration {
  return { id: id.repeat(12), from, to }
}
