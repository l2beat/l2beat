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
import { MOCK_TRX, mockDatabase } from '../../test/database'
import { IndexerService } from './IndexerService'

describe(IndexerService.name, () => {
  it(IndexerService.prototype.getSafeHeight.name, async () => {
    const safeHeight = 123
    const indexerStateRepository = mockObject<Database['indexerState']>({
      findIndexerState: async () => mock({ safeHeight }),
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    const result = await indexerService.getSafeHeight('indexer')

    expect(result).toEqual(safeHeight)
    expect(indexerStateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.getIndexerState.name, async () => {
    const configHash = '0x123456'
    const indexerStateRepository = mockObject<Database['indexerState']>({
      findIndexerState: async () => mock({ configHash }),
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    const result = await indexerService.getIndexerState('indexer')

    expect(result).toEqual(mock({ configHash }))
    expect(indexerStateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.setSafeHeight.name, async () => {
    const indexerStateRepository = mockObject<Database['indexerState']>({
      setSafeHeight: async () => 1,
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    await indexerService.setSafeHeight('indexer', 123)
    expect(indexerStateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
      'indexer',
      123,
    )
  })

  it(IndexerService.prototype.setInitialState.name, async () => {
    const indexerStateRepository = mockObject<Database['indexerState']>({
      addOrUpdate: async () => '',
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: mockObject(),
      }),
    )

    await indexerService.setInitialState('indexer', 123, 'hash')
    expect(indexerStateRepository.addOrUpdate).toHaveBeenOnlyCalledWith({
      indexerId: 'indexer',
      safeHeight: 123,
      configHash: 'hash',
    })
  })

  it(IndexerService.prototype.upsertConfigurations.name, async () => {
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      addOrUpdateMany: async () => {},
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

    expect(
      indexerConfigurationsRepository.addOrUpdateMany,
    ).toHaveBeenOnlyCalledWith([
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
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      getSavedConfigurations: async () => [
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
      },
      {
        id: 'b',
        currentHeight: null,
        minHeight: 0,
        maxHeight: null,
      },
    ])
  })

  it(IndexerService.prototype.updateSavedConfigurations.name, async () => {
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      updateSavedConfigurations: async () => [],
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    await indexerService.updateSavedConfigurations('indexer', 123, MOCK_TRX)

    expect(
      indexerConfigurationsRepository.updateSavedConfigurations,
    ).toHaveBeenOnlyCalledWith('indexer', 123, MOCK_TRX)
  })

  it(IndexerService.prototype.persistOnlyUsedConfigurations.name, async () => {
    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      deleteConfigurationsExcluding: async () => -1,
    })

    const indexerService = new IndexerService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    await indexerService.persistOnlyUsedConfigurations('indexer', ['a', 'b'])

    expect(
      indexerConfigurationsRepository.deleteConfigurationsExcluding,
    ).toHaveBeenOnlyCalledWith('indexer', ['a', 'b'])
  })

  it(IndexerService.prototype.getAmountsStatus.name, async () => {
    const targetTimestamp = UnixTime.now()

    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      getSavedConfigurationsByIds: async () => [
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
      indexerConfigurationsRepository.getSavedConfigurationsByIds,
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
      getSavedConfigurationsByIds: async () => [
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
      indexerConfigurationsRepository.getSavedConfigurationsByIds,
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
