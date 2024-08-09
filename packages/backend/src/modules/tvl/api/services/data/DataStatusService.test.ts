import {
  Database,
  IndexerConfigurationRecord,
  IndexerStateRecord,
} from '@l2beat/database'
import { AmountConfigEntry, CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../../../test/database'
import { DataStatusService } from './DataStatusService'

describe(DataStatusService.name, () => {
  it(DataStatusService.prototype.getAmountsStatus.name, async () => {
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
      getByIndexerIds: mockFn()
        .resolvesToOnce([
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
        ])
        // TODO: test preminted
        .resolvesToOnce([]),
    })

    const indexerService = new DataStatusService(
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

    expect(indexerStateRepository.getByIndexerIds).toHaveBeenNthCalledWith(1, [
      'circulating_supply_indexer::g',
      'circulating_supply_indexer::h',
      'circulating_supply_indexer::i',
      'circulating_supply_indexer::j',
    ])

    expect(indexerStateRepository.getByIndexerIds).toHaveBeenNthCalledWith(
      2,
      // TODO:test preminted
      [],
    )
  })

  it(DataStatusService.prototype.getConfigurationsStatus.name, async () => {
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

    const indexerService = new DataStatusService(
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
