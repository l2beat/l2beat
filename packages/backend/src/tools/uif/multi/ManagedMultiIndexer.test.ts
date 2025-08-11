import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { describeDatabase, mockDatabase } from '../../../test/database'
import { IndexerService } from '../IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../ids'
import { ManagedMultiIndexer } from './ManagedMultiIndexer'
import type {
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
      }).toThrow('Configuration id a is duplicated in other-name')
    })
  })

  describe(ManagedMultiIndexer.prototype.initialize.name, () => {
    it('gets previous state and returns safeHeight based on configurations', async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [saved('a', 100, null, 1000)],
        insertConfigurations: async () => {},
      })

      const indexer = new TestIndexer({
        ...common,
        indexerService,
        configurations: [actual('a', 100, null), actual('b', 100, null)],
      })

      const newHeight = await indexer.initialize()

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

  describe(ManagedMultiIndexer.prototype.updateSavedConfigurations.name, () => {
    it('adds, updates, deletes and trims', async () => {
      const indexerService = mockObject<IndexerService>({
        insertConfigurations: async () => {},
        upsertConfigurations: async () => {},
        deleteConfigurations: async () => {},
      })
      const db = mockObject<Database>({
        transaction: async (fun) => await fun(),
      })
      const indexer = new TestIndexer({ ...common, indexerService, db })

      await indexer.updateSavedConfigurations({
        toAdd: [actual('a', 100, null)],
        toUpdate: [
          saved('b', 100, 1000, 1000, 'props'),
          saved('c', 100, 1000, 1000, 'props'),
        ],
        toTrimDataAfterUpdate: [removal('b', 50, 99), removal('b', 1001, 1500)],
        toWipeDataAfterUpdate: [removal('c', 200, 1000)],
        toDelete: ['d'],
        toWipeDataAfterDelete: [removal('d', 100, 1000)],
      })

      expect(indexerService.insertConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        [actual('a', 100, null)],
        SERIALIZE,
      )
      expect(indexerService.upsertConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        [
          saved('b', 100, 1000, 1000, 'props'),
          saved('c', 100, 1000, 1000, 'props'),
        ],
        SERIALIZE,
      )
      expect(indexerService.deleteConfigurations).toHaveBeenOnlyCalledWith(
        INDEXER_ID,
        ['d'],
      )
      expect(indexer.removeData).toHaveBeenNthCalledWith(1, [
        removal('b', 50, 99),
        removal('b', 1001, 1500),
      ])
      expect(indexer.removeData).toHaveBeenNthCalledWith(2, [
        removal('c', 200, 1000),
      ])
      expect(indexer.removeData).toHaveBeenNthCalledWith(3, [
        removal('d', 100, 1000),
      ])

      expect(db.transaction).toHaveBeenCalledTimes(1)
    })
  })

  describe(ManagedMultiIndexer.prototype.update.name, () => {
    it('skips if range is empty, returns correct to', async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [saved('a', 100, null, null)],
      })

      const indexer = new TestIndexer({
        ...common,
        indexerService,
        configurations: [actual('a', 100, null)],
      })
      await indexer.initialize()

      // Configuration starts at 100, this range will be empty
      const newHeight = await indexer.update(0, 50)

      expect(indexer.multiUpdate).not.toHaveBeenCalled()
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

      const indexer = new TestIndexer({
        ...common,
        db,
        indexerService,
        configurations: [actual('a', 100, null), actual('b', 100, null)],
      })
      const saveData = mockFn((targetHeight) => Promise.resolve(targetHeight))
      indexer.multiUpdate = mockFn<ManagedMultiIndexer<string>['multiUpdate']>(
        async (_, targetHeight) => () => saveData(targetHeight),
      )

      await indexer.initialize()
      const newHeight = await indexer.update(1001, 1100)

      expect(indexer.multiUpdate).toHaveBeenOnlyCalledWith(1001, 1100, [
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
      const indexer = new TestIndexer({
        ...common,
      })

      await indexer.initialize()

      indexer.multiUpdate.resolvesTo(() => Promise.resolve(50))
      await expect(indexer.update(100, 500)).toBeRejectedWith(
        /Returned height must be between from and to/,
      )

      indexer.multiUpdate.resolvesTo(() => Promise.resolve(50_000))
      await expect(indexer.update(100, 500)).toBeRejectedWith(
        /Returned height must be between from and to/,
      )
    })
  })

  describe(ManagedMultiIndexer.prototype.findRange.name, () => {
    let indexer: ManagedMultiIndexer<string>

    beforeEach(async () => {
      const indexerService = mockObject<IndexerService>({
        getSavedConfigurations: async () => [saved('a', 100, 200, null)],
      })
      indexer = new TestIndexer({
        ...common,
        indexerService,
        configurations: [actual('a', 100, 200)],
      })
      await indexer.initialize()
    })

    it('finds range correctly for a value before the start', () => {
      const fromBeforeStart = 10
      expect(indexer.findRange(fromBeforeStart)).toEqual({
        from: Number.NEGATIVE_INFINITY,
        to: 99,
        configurations: [],
      })
    })

    it('finds range correctly for a value at the start', () => {
      const fromAtStart = 100
      expect(indexer.findRange(fromAtStart)).toEqual({
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200)],
      })
    })

    it('finds range correctly for a value between start and end', () => {
      const fromBetween = 150
      expect(indexer.findRange(fromBetween)).toEqual({
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200)],
      })
    })

    it('finds range correctly for a value at the end', () => {
      const fromAtEnd = 200
      expect(indexer.findRange(fromAtEnd)).toEqual({
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200)],
      })
    })

    it('finds range correctly for a value after the end', () => {
      const fromAfterStart = 250
      expect(indexer.findRange(fromAfterStart)).toEqual({
        from: 201,
        to: Number.POSITIVE_INFINITY,
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

        const indexer = new TestIndexer({ ...common, indexerService })

        await indexer.updateConfigurationsCurrentHeight(100)

        expect(
          indexerService.updateConfigurationsCurrentHeight,
        ).toHaveBeenOnlyCalledWith(INDEXER_ID, 100)
      })
    },
  )

  describe(ManagedMultiIndexer.prototype.invalidate.name, () => {
    it('returns target height', async () => {
      const indexer = new TestIndexer({ ...common })

      const targetHeight = await indexer.invalidate(100)

      expect(targetHeight).toEqual(100)
    })
  })

  it(ManagedMultiIndexer.prototype.setInitialState.name, async () => {
    const indexerService = mockObject<IndexerService>({
      setInitialState: async () => {},
    })
    const indexer = new TestIndexer({ ...common, indexerService })

    await indexer.setInitialState(100, 'config-hash')

    expect(indexerService.setInitialState).toHaveBeenOnlyCalledWith(
      INDEXER_ID,
      100,
      'config-hash',
    )
  })
  it(ManagedMultiIndexer.prototype.setSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      setSafeHeight: async () => {},
    })
    const indexer = new TestIndexer({ ...common, indexerService })

    await indexer.setSafeHeight(100)

    expect(indexerService.setSafeHeight).toHaveBeenOnlyCalledWith(
      INDEXER_ID,
      100,
    )
  })

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

      expect(configurations).toEqualUnsorted([
        saved('a', 100, 300, 300),
        saved('b', 200, 500, 500),
        saved('c', 400, null, 600),
        saved('d', 100, null, 600),
      ])
    })

    it('configuration removed', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('a', 400, null, 550), saved('d', 100, null, 550)],
        [actual('a', 400, null)],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([
        saved('a', 400, null, 550),
        saved('d', 100, null, 550),
      ])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([saved('a', 400, null, 550)])

      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 550),
      ])
    })

    it('minHeight changed to earlier than previously set', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 50, null)],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([saved('d', 100, null, 550)])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([saved('d', 50, null, null)])

      // remove all data
      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 550),
      ])
    })

    it('minHeight changed to later than previously set', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 150, null)],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([saved('d', 100, null, 550)])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([saved('d', 150, null, 550)])

      // remove part of data
      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 149),
      ])
    })

    it('minHeight changed to later than previously set and currentHeight', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 1000, null)],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([saved('d', 100, null, 550)])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([saved('d', 1000, null, null)])

      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 999),
      ])
    })

    it('maxHeight changed without need to trim', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 100, 1000)],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([saved('d', 100, null, 550)])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([saved('d', 100, 1000, 550)])

      expect(indexer.removeData).not.toHaveBeenCalled()
    })

    it('maxHeight changed with need to trim', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [saved('d', 100, null, 550)],
        [actual('d', 100, 200)],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([saved('d', 100, null, 550)])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([saved('d', 100, 200, 200)])

      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 201, 550),
      ])
    })

    it('properties changed', async () => {
      const indexer = await initializeMockIndexer(
        indexerService,
        [{ ...saved('d', 100, null, 550), properties: 'old-props' }],
        [{ ...actual('d', 100, null), properties: 'new-props' }],
      )

      const before =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(before).toEqualUnsorted([
        { ...saved('d', 100, null, 550), properties: 'old-props' },
      ])

      await indexer.start()

      const after =
        await db.indexerConfiguration.getConfigurationsWithoutIndexerId(
          INDEXER_ID,
        )
      expect(after).toEqualUnsorted([
        {
          ...saved('d', 100, null, 550),
          properties: JSON.stringify('new-props'),
        },
      ])
    })
  })
})

class TestIndexer extends ManagedMultiIndexer<string> {
  override readonly options: ManagedMultiIndexerOptions<string>

  constructor(options: ManagedMultiIndexerOptions<string>) {
    super(options)
    this.options = options
  }

  multiUpdate = mockFn<ManagedMultiIndexer<string>['multiUpdate']>(
    async (_, targetHeight) => () => Promise.resolve(targetHeight),
  )
  removeData =
    mockFn<ManagedMultiIndexer<string>['removeData']>().resolvesTo(undefined)
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

async function getSavedConfigurations(indexerService: IndexerService) {
  return await indexerService.getSavedConfigurations('indexer')
}

async function initializeMockIndexer(
  indexerService: IndexerService,
  saved: SavedConfiguration<string>[],
  configurations: Configuration<string>[],
  database?: Database,
) {
  if (saved.length > 0) {
    await indexerService.upsertConfigurations('indexer', saved, (v) => v)
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
