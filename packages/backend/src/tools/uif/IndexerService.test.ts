import type { Database, IndexerStateRecord } from '@l2beat/database'
import type { json } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../test/database'
import { IndexerService } from './IndexerService'

describe(IndexerService.name, () => {
  it(IndexerService.prototype.getSafeHeight.name, async () => {
    const safeHeight = 123
    const indexerStateRepository = {
      findByIndexerId: vi.fn(async () => mock({ safeHeight })),
    } as unknown as Database['indexerState']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: {} as unknown as Database['indexerConfiguration'],
      }),
    )

    const result = await indexerService.getSafeHeight('indexer')

    expect(result).toStrictEqual(safeHeight)
    expect(
      indexerStateRepository.findByIndexerId,
    ).toHaveBeenCalledExactlyOnceWith('indexer')
  })

  it(IndexerService.prototype.getIndexerState.name, async () => {
    const configHash = '0x123456'
    const indexerStateRepository = {
      findByIndexerId: vi.fn(async () => mock({ configHash })),
    } as unknown as Database['indexerState']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: {} as unknown as Database['indexerConfiguration'],
      }),
    )

    const result = await indexerService.getIndexerState('indexer')

    expect(result).toStrictEqual(mock({ configHash }))
    expect(
      indexerStateRepository.findByIndexerId,
    ).toHaveBeenCalledExactlyOnceWith('indexer')
  })

  it(IndexerService.prototype.setSafeHeight.name, async () => {
    const indexerStateRepository = {
      updateSafeHeight: vi.fn(async () => 1),
    } as unknown as Database['indexerState']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: {} as unknown as Database['indexerConfiguration'],
      }),
    )

    await indexerService.setSafeHeight('indexer', 123)
    expect(
      indexerStateRepository.updateSafeHeight,
    ).toHaveBeenCalledExactlyOnceWith('indexer', 123)
  })

  it(IndexerService.prototype.setInitialState.name, async () => {
    const indexerStateRepository = {
      upsert: vi.fn(async () => undefined),
    } as unknown as Database['indexerState']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: {} as unknown as Database['indexerConfiguration'],
      }),
    )

    await indexerService.setInitialState('indexer', 123, 'hash')
    expect(indexerStateRepository.upsert).toHaveBeenCalledExactlyOnceWith({
      indexerId: 'indexer',
      safeHeight: 123,
      configHash: 'hash',
    })
  })

  it(IndexerService.prototype.upsertConfigurations.name, async () => {
    const indexerConfigurationsRepository = {
      upsertMany: vi.fn(async () => 0),
    } as unknown as Database['indexerConfiguration']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: {} as unknown as Database['indexerState'],
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

    expect(
      indexerConfigurationsRepository.upsertMany,
    ).toHaveBeenCalledExactlyOnceWith([
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
    ])
  })

  it(IndexerService.prototype.getSavedConfigurations.name, async () => {
    const indexerConfigurationsRepository = {
      getConfigurationsWithoutIndexerId: vi.fn(async () => [
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
      ]),
    } as unknown as Database['indexerConfiguration']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: {} as unknown as Database['indexerState'],
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    const result = await indexerService.getSavedConfigurations('indexer')

    expect(result).toHaveLength(2)
    expect(result).toStrictEqual(
      expect.arrayContaining([
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
      ]),
    )
  })

  it(
    IndexerService.prototype.updateConfigurationsCurrentHeight.name,
    async () => {
      const indexerConfigurationsRepository = {
        updateCurrentHeights: vi.fn(async () => undefined),
      } as unknown as Database['indexerConfiguration']

      const indexerService = new IndexerService(
        mockDatabase({
          indexerState: {} as unknown as Database['indexerState'],
          indexerConfiguration: indexerConfigurationsRepository,
        }),
      )

      await indexerService.updateConfigurationsCurrentHeight('indexer', 123)

      expect(
        indexerConfigurationsRepository.updateCurrentHeights,
      ).toHaveBeenCalledExactlyOnceWith('indexer', 123)
    },
  )

  it(IndexerService.prototype.deleteConfigurations.name, async () => {
    const indexerConfigurationsRepository = {
      deleteConfigurations: vi.fn(async () => -1),
      getIdsByIndexer: vi.fn(async () => ['a', 'b', 'c']),
    } as unknown as Database['indexerConfiguration']

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: {} as unknown as Database['indexerState'],
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    await indexerService.deleteConfigurations('indexer', ['a', 'b'])

    expect(
      indexerConfigurationsRepository.deleteConfigurations,
    ).toHaveBeenCalledExactlyOnceWith('indexer', ['a', 'b'])
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
