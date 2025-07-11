import type { Database, IndexerStateRecord } from '@l2beat/database'
import type { json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import { IndexerService } from './IndexerService'

describe(IndexerService.name, () => {
  it(IndexerService.prototype.getSafeHeight.name, async () => {
    const safeHeight = 123
    const indexerStateRepository = mockObject<Database['indexerState']>({
      findByIndexerId: async () => mock({ safeHeight }),
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    const result = await indexerService.getSafeHeight('indexer')

    expect(result).toEqual(safeHeight)
    expect(indexerStateRepository.findByIndexerId).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.getIndexerState.name, async () => {
    const configHash = '0x123456'
    const indexerStateRepository = mockObject<Database['indexerState']>({
      findByIndexerId: async () => mock({ configHash }),
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    const result = await indexerService.getIndexerState('indexer')

    expect(result).toEqual(mock({ configHash }))
    expect(indexerStateRepository.findByIndexerId).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.setSafeHeight.name, async () => {
    const indexerStateRepository = mockObject<Database['indexerState']>({
      updateSafeHeight: async () => 1,
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    await indexerService.setSafeHeight('indexer', 123)
    expect(indexerStateRepository.updateSafeHeight).toHaveBeenOnlyCalledWith(
      'indexer',
      123,
    )
  })

  it(IndexerService.prototype.setInitialState.name, async () => {
    const indexerStateRepository = mockObject<Database['indexerState']>({
      upsert: async () => undefined,
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    await indexerService.setInitialState('indexer', 123, 'hash')
    expect(indexerStateRepository.upsert).toHaveBeenOnlyCalledWith({
      indexerId: 'indexer',
      safeHeight: 123,
      configHash: 'hash',
    })
  })

  it(IndexerService.prototype.upsertConfigurations.name, async () => {
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      upsertMany: async () => 0,
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    await indexerService.upsertConfigurations(
      'indexer',
      [
        {
          id: 'a',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: { a: 1 },
        },
        {
          id: 'b',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: { b: 1 },
        },
      ],
      (properties: json) => JSON.stringify(properties),
    )

    expect(indexerConfigurationsRepository.upsertMany).toHaveBeenOnlyCalledWith(
      [
        {
          id: 'a',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: JSON.stringify({ a: 1 }),
          indexerId: 'indexer',
        },
        {
          id: 'b',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: JSON.stringify({ b: 1 }),
          indexerId: 'indexer',
        },
      ],
    )
  })

  it(IndexerService.prototype.getSavedConfigurations.name, async () => {
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      getConfigurationsWithoutIndexerId: async () => [
        {
          id: 'a',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: JSON.stringify({ a: 1 }),
        },
        {
          id: 'b',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: JSON.stringify({ b: 1 }),
        },
      ],
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    const result = await indexerService.getSavedConfigurations('indexer')

    expect(result).toEqualUnsorted([
      {
        id: 'a',
        currentHeight: null,
        minHeight: 0,
        maxHeight: null,
        properties: JSON.stringify({ a: 1 }),
      },
      {
        id: 'b',
        currentHeight: null,
        minHeight: 0,
        maxHeight: null,
        properties: JSON.stringify({ b: 1 }),
      },
    ])
  })

  it(
    IndexerService.prototype.updateConfigurationsCurrentHeight.name,
    async () => {
      const indexerConfigurationsRepository = mockObject<
        Database['indexerConfiguration']
      >({
        updateCurrentHeights: async () => undefined,
      })

      const indexerService = new IndexerService(
        mockDatabase({
          indexerState: mockObject(),
          indexerConfiguration: indexerConfigurationsRepository,
        }),
      )

      await indexerService.updateConfigurationsCurrentHeight('indexer', 123)

      expect(
        indexerConfigurationsRepository.updateCurrentHeights,
      ).toHaveBeenOnlyCalledWith('indexer', 123)
    },
  )

  it(IndexerService.prototype.deleteConfigurations.name, async () => {
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      deleteConfigurations: async () => -1,
      getIdsByIndexer: async () => ['a', 'b', 'c'],
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    await indexerService.deleteConfigurations('indexer', ['a', 'b'])

    expect(
      indexerConfigurationsRepository.deleteConfigurations,
    ).toHaveBeenOnlyCalledWith('indexer', ['a', 'b'])
  })
})

function mock(v: Partial<IndexerStateRecord>): IndexerStateRecord {
  return {
    indexerId: 'indexer',
    safeHeight: 1,
    configHash: '0x123456',
    minTimestamp: 0,
    ...v,
  }
}
