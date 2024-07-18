import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'

import { DatabaseMiddleware } from '../../../peripherals/database/DatabaseMiddleware'
import { describeDatabase } from '../../../test/database'
import { IndexerConfigurationRepository } from '../IndexerConfigurationRepository'
import { IndexerService } from '../IndexerService'
import { IndexerStateRepository } from '../IndexerStateRepository'
import { _TEST_ONLY_resetUniqueIds } from '../ids'
import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from './ManagedMultiIndexer'
import { MultiIndexer } from './MultiIndexer'
import { mockDbMiddleware } from './MultiIndexer.test'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

describe(ManagedMultiIndexer.name, () => {
  afterEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('constructor throws on duplicate indexer ids', () => {
      const common = {
        parents: [],
        configurations: [],
        indexerService: mockObject<IndexerService>(),
        logger: Logger.SILENT,
        serializeConfiguration: (v: null) => JSON.stringify(v),
        createDatabaseMiddleware: async () =>
          mockObject<DatabaseMiddleware>({}),
      }
      new TestIndexer({ ...common, name: 'a' })
      expect(() => {
        new TestIndexer({ ...common, name: 'a' })
      }).toThrow('Indexer id a is duplicated!')
    })

    it('constructor throws on duplicate configuration ids', () => {
      const common = {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        logger: Logger.SILENT,
        serializeConfiguration: (v: null) => JSON.stringify(v),
        createDatabaseMiddleware: async () =>
          mockObject<DatabaseMiddleware>({}),
      }
      new TestIndexer({
        ...common,
        name: 'a',
        configurations: [actual('a', 100, 300), actual('b', 100, 300)],
      })
      expect(() => {
        new TestIndexer({
          ...common,
          name: 'b',
          configurations: [actual('a', 100, 300)],
        })
      }).toThrow('Configuration id aaaaaaaaaaaa is duplicated!')
    })
  })

  it(ManagedMultiIndexer.prototype.getSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      getSafeHeight: async () => 1,
    })

    const indexer = await initializeMockIndexer(indexerService, [], [])

    const result = await indexer.getSafeHeight()

    expect(result).toEqual(1)
    expect(indexerService.getSafeHeight).toHaveBeenOnlyCalledWith('indexer')
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

    expect(result).toEqual(configurations)
    expect(indexerService.getSavedConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(ManagedMultiIndexer.prototype.setSavedConfigurations.name, async () => {
    const configurations = [saved('a', 100, null, null)]

    const indexerService = mockObject<IndexerService>({
      upsertConfigurations: async () => {},
      updateSavedConfigurations: async () => {},
      persistOnlyUsedConfigurations: async () => {},
    })

    const indexer = await initializeMockIndexer(indexerService, [], [])

    await indexer.setSavedConfigurations(configurations)

    expect(indexerService.upsertConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
      configurations,
      expect.anything(),
    )
    expect(
      indexerService.persistOnlyUsedConfigurations,
    ).toHaveBeenOnlyCalledWith(
      'indexer',
      configurations.map((c) => c.id),
    )
  })

  it(
    ManagedMultiIndexer.prototype.updateConfigurationsCurrentHeight.name,
    async () => {
      const indexerService = mockObject<IndexerService>({
        upsertConfigurations: async () => {},
        updateSavedConfigurations: async () => {},
        persistOnlyUsedConfigurations: async () => {},
      })

      const indexer = await initializeMockIndexer(indexerService, [], [])

      await indexer.updateConfigurationsCurrentHeight(1, mockDbMiddleware)

      expect(indexerService.updateSavedConfigurations).toHaveBeenNthCalledWith(
        1,
        'indexer',
        1,
        mockDbMiddleware,
      )
    },
  )

  describeDatabase('e2e', (database) => {
    const stateRepository = new IndexerStateRepository(database, Logger.SILENT)
    const configurationsRepository = new IndexerConfigurationRepository(
      database,
      Logger.SILENT,
    )
    const indexerService = new IndexerService(
      stateRepository,
      configurationsRepository,
    )
    afterEach(async () => {
      _TEST_ONLY_resetUniqueIds()
      await stateRepository.deleteAll()
      await configurationsRepository.deleteAll()
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
      )
      await indexer.start()

      const target = 600
      let current = 99
      // This "+1" logic mimics Indexer.executeUpdate
      while (current + 1 < target) {
        current = await indexer.update(current + 1, target)
      }

      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(
        1,
        100,
        199,
        [actual('a', 100, 300)],
        mockDbMiddleware,
      )
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(
        2,
        200,
        300,
        [actual('a', 100, 300), actual('b', 200, 500)],
        mockDbMiddleware,
      )
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(
        3,
        301,
        399,
        [actual('b', 200, 500)],
        mockDbMiddleware,
      )
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(
        4,
        400,
        500,
        [actual('b', 200, 500), actual('c', 400, null)],
        mockDbMiddleware,
      )
      expect(indexer.multiUpdate).toHaveBeenLastCalledWith(
        551,
        600,
        [actual('c', 400, null), actual('d', 100, null)],
        mockDbMiddleware,
      )

      const configurations = await getSavedConfigurations(indexerService)

      expect(configurations).toEqualUnsorted([
        savedWithoutProperties('a', 100, 300, 300),
        savedWithoutProperties('b', 200, 500, 500),
        savedWithoutProperties('c', 400, null, 600),
        savedWithoutProperties('d', 100, null, 600),
      ])
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
  })
})

class TestIndexer extends ManagedMultiIndexer<null> {
  constructor(override readonly options: ManagedMultiIndexerOptions<null>) {
    super(options)
  }
  multiUpdate = mockFn<MultiIndexer<null>['multiUpdate']>(
    (_, targetHeight, configurations) =>
      Promise.resolve({
        safeHeight: targetHeight,
        updatedConfigurations: configurations,
      }),
  )
  removeData = mockFn<MultiIndexer<null>['removeData']>().resolvesTo(undefined)
}

async function getSavedConfigurations(indexerService: IndexerService) {
  return await indexerService.getSavedConfigurations('indexer')
}

async function initializeMockIndexer(
  indexerService: IndexerService,
  saved: SavedConfiguration<null>[],
  configurations: Configuration<null>[],
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
    createDatabaseMiddleware: () => Promise.resolve(mockDbMiddleware),
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

function savedWithoutProperties(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): Omit<SavedConfiguration<null>, 'properties'> {
  return {
    id: id.repeat(12),
    minHeight,
    maxHeight,
    currentHeight,
  }
}

function removal(id: string, from: number, to: number): RemovalConfiguration {
  return { id: id.repeat(12), from, to }
}
