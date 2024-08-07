import {
  Database,
  IndexerConfigurationRecord,
  IndexerStateRecord,
} from '@l2beat/database'
import {
  AmountConfigEntry,
  CoingeckoId,
  UnixTime,
  json,
} from '@l2beat/shared-pure'
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

  it(IndexerService.prototype.getAmountsStatus.name, async () => {
    const targetTimestamp = UnixTime.now()

    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      getByConfigurationIds: async () => [
        config('a', 0, null, null),
        config('b', 0, null, targetTimestamp.toNumber()),
        config('c', 0, 100, 100),
        config('d', 0, 100, targetTimestamp.add(-1, 'hours').toNumber()),
        config('e', 0, 100, targetTimestamp.add(-10, 'days').toNumber()),
      ],
    })

    const indexerStateRepository = mockObject<Database['indexerState']>({
      getByIndexerIds: async () => [
        mock({
          indexerId: 'circulating_supply_indexer::g',
          safeHeight: targetTimestamp.toNumber(),
        }),
        mock({
          indexerId: 'circulating_supply_indexer::h',
          safeHeight: targetTimestamp.add(-1, 'hours').toNumber(),
        }),
        mock({
          indexerId: 'circulating_supply_indexer::i',
          safeHeight: targetTimestamp.add(-10, 'days').toNumber(),
        }),
      ],
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    const result = await indexerService.getAmountsStatus(
      [
        configuration('a', undefined, 'escrow'),
        configuration('b', undefined, 'escrow'),
        configuration('c', undefined, 'escrow'),
        configuration('d', undefined, 'escrow'),
        configuration('e', undefined, 'escrow'),
        configuration('f', undefined, 'escrow'),
        configuration('g', CoingeckoId('g'), 'circulatingSupply'),
        configuration('h', CoingeckoId('h'), 'circulatingSupply'),
        configuration('i', CoingeckoId('i'), 'circulatingSupply'),
        configuration('j', CoingeckoId('j'), 'circulatingSupply'),
      ],
      targetTimestamp,
    )

    expect(result).toEqual({
      excluded: new Set(['a', 'e', 'f', 'i', 'j']),
      lagging: [
        {
          id: 'd',
          latestTimestamp: targetTimestamp.add(-1, 'hours'),
        },
        {
          id: 'h',
          latestTimestamp: targetTimestamp.add(-1, 'hours'),
        },
      ],
    })

    expect(
      indexerConfigurationsRepository.getByConfigurationIds,
    ).toHaveBeenOnlyCalledWith(['a', 'b', 'c', 'd', 'e', 'f'])

    expect(indexerStateRepository.getByIndexerIds).toHaveBeenOnlyCalledWith([
      'circulating_supply_indexer::g',
      'circulating_supply_indexer::h',
      'circulating_supply_indexer::i',
      'circulating_supply_indexer::j',
    ])
  })

  it(IndexerService.prototype.getConfigurationsStatus.name, async () => {
    const targetTimestamp = UnixTime.now()

    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      getByConfigurationIds: async () => [
        config('a', 0, null, null),
        config('b', 0, null, targetTimestamp.toNumber()),
        config('c', 0, 100, 100),
        config('d', 0, 100, targetTimestamp.add(-1, 'hours').toNumber()),
        config('e', 0, 100, targetTimestamp.add(-10, 'days').toNumber()),
      ],
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    const result = await indexerService.getConfigurationsStatus(
      [
        { configId: 'a' },
        { configId: 'b' },
        { configId: 'c' },
        { configId: 'd' },
        { configId: 'e' },
        { configId: 'f' },
      ],
      targetTimestamp,
    )

    expect(result).toEqual({
      excluded: new Set(['a', 'e', 'f']),
      lagging: [
        {
          id: 'd',
          latestTimestamp: targetTimestamp.add(-1, 'hours'),
        },
      ],
    })

    expect(
      indexerConfigurationsRepository.getByConfigurationIds,
    ).toHaveBeenOnlyCalledWith(['a', 'b', 'c', 'd', 'e', 'f'])
  })
})

function mock(v: Partial<IndexerStateRecord>): IndexerStateRecord {
  return {
    indexerId: 'indexer',
    safeHeight: 1,
    configHash: '0x123456',
    minTimestamp: UnixTime.ZERO,
    ...v,
  }
}

function config(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): IndexerConfigurationRecord {
  return {
    id,
    indexerId: 'indexer',
    properties: '',
    minHeight,
    maxHeight,
    currentHeight,
  }
}

function configuration(
  configId: string,
  coingeckoId: CoingeckoId | undefined,
  type: 'circulatingSupply' | 'escrow',
) {
  return mockObject<AmountConfigEntry & { configId: string }>({
    configId,
    coingeckoId,
    type,
  })
}
