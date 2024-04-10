import { Logger } from '@l2beat/backend-tools'
import {
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
} from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'

import { describeDatabase } from '../../../test/database'
import { _TEST_ONLY_resetUniqueIds } from '../ids'
import { IndexerConfigurationRepository } from '../IndexerConfigurationRepository'
import { IndexerService } from '../IndexerService'
import { IndexerStateRepository } from '../IndexerStateRepository'
import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from './ManagedMultiIndexer'
import { MultiIndexer } from './MultiIndexer'
import { Configuration } from './types'

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
        encode: (v: string) => v,
        decode: (blob: string) => blob,
      }
      new TestIndexer({ ...common, id: 'a' })
      expect(() => {
        new TestIndexer({ ...common, id: 'a' })
      }).toThrow('Indexer id a is duplicated!')
    })

    it('constructor throws on duplicate configuration ids', () => {
      const common = {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        logger: Logger.SILENT,
        encode: (v: string) => v,
        decode: (blob: string) => blob,
      }
      new TestIndexer({
        ...common,
        id: 'a',
        configurations: [actual('a', 100, 300), actual('b', 100, 300)],
      })
      expect(() => {
        new TestIndexer({
          ...common,
          id: 'b',
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
      expect.anything(),
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

  it(ManagedMultiIndexer.prototype.updateCurrentHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      upsertConfigurations: async () => {},
      updateSavedConfigurations: async () => {},
      persistOnlyUsedConfigurations: async () => {},
    })

    const indexer = await initializeMockIndexer(indexerService, [], [])

    await indexer.updateCurrentHeight(['a', 'b', 'c'], 1)

    expect(indexerService.updateSavedConfigurations).toHaveBeenNthCalledWith(
      1,
      'indexer',
      ['a', 'b', 'c'],
      1,
    )
  })

  describeDatabase(' e2e', (database) => {
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

      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(1, 100, 199, [
        update('a', 100, 300, false),
        update('d', 100, null, true),
      ])
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(2, 200, 300, [
        update('a', 100, 300, false),
        update('b', 200, 500, false),
        update('d', 100, null, true),
      ])
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(3, 301, 399, [
        update('b', 200, 500, false),
        update('d', 100, null, true),
      ])
      expect(indexer.multiUpdate).toHaveBeenNthCalledWith(4, 400, 500, [
        update('b', 200, 500, false),
        update('c', 400, null, false),
        update('d', 100, null, true),
      ])
      expect(indexer.multiUpdate).toHaveBeenLastCalledWith(551, 600, [
        update('c', 400, null, false),
        update('d', 100, null, false),
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
        [saved('d', 100, null, 550)],
        [],
      )
      await indexer.start()

      const configurations = await getSavedConfigurations(indexerService)

      expect(configurations).toEqualUnsorted([])
      expect(indexer.removeData).toHaveBeenOnlyCalledWith([
        removal('d', 100, 550),
      ])
    })
  })
})

class TestIndexer extends ManagedMultiIndexer<string> {
  constructor(override readonly options: ManagedMultiIndexerOptions<string>) {
    super(options)
  }
  multiUpdate = mockFn<MultiIndexer<string>['multiUpdate']>((_, targetHeight) =>
    Promise.resolve(targetHeight),
  )
  removeData =
    mockFn<MultiIndexer<string>['removeData']>().resolvesTo(undefined)
}

async function getSavedConfigurations(indexerService: IndexerService) {
  return await indexerService.getSavedConfigurations('indexer', (v) => v)
}

async function initializeMockIndexer(
  indexerService: IndexerService,
  saved: SavedConfiguration<string>[],
  configurations: Configuration<string>[],
) {
  if (saved.length > 0) {
    await indexerService.upsertConfigurations('indexer', saved, (v) => v)
  }
  const indexer = new TestIndexer({
    parents: [],
    id: 'indexer',
    indexerService,
    configurations,
    logger: Logger.SILENT,
    encode: (v) => v,
    decode: (v) => v,
  })
  return indexer
}

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<string> {
  return { id: id.repeat(12), properties: '', minHeight, maxHeight }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): SavedConfiguration<string> {
  return {
    id: id.repeat(12),
    properties: '',
    minHeight,
    maxHeight,
    currentHeight,
  }
}

function update(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  hasData: boolean,
): UpdateConfiguration<string> {
  return { id: id.repeat(12), properties: '', minHeight, maxHeight, hasData }
}

function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration<string> {
  return { id: id.repeat(12), properties: '', from, to }
}
