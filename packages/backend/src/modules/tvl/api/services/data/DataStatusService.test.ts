import {
  Database,
  IndexerConfigurationRecord,
  IndexerStateRecord,
} from '@l2beat/database'
import {
  CirculatingSupplyEntry,
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  EscrowEntry,
  EthereumAddress,
  PremintedEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
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
        configuration('a', 0, null, null),
        configuration('b', 0, null, targetTimestamp.toNumber()),
        configuration('c', 0, 100, 100),
        configuration('d', 0, 100, targetTimestamp.add(-1, 'hours').toNumber()),
        configuration('e', 0, 100, targetTimestamp.add(-10, 'days').toNumber()),
      ],
    })

    const indexerStateRepository = mockObject<Database['indexerState']>({
      getByIndexerIds: mockFn()
        .resolvesToOnce([
          indexerState({
            indexerId: 'preminted_indexer::k_k',
            safeHeight: targetTimestamp.toNumber(),
          }),
          indexerState({
            indexerId: 'preminted_indexer::l_l',
            safeHeight: targetTimestamp.add(-1, 'hours').toNumber(),
          }),
          indexerState({
            indexerId: 'preminted_indexer::m_m',
            safeHeight: targetTimestamp.add(-10, 'days').toNumber(),
          }),
        ])
        .resolvesToOnce([
          indexerState({
            indexerId: 'circulating_supply_indexer::g',
            safeHeight: targetTimestamp.toNumber(),
          }),
          indexerState({
            indexerId: 'circulating_supply_indexer::h',
            safeHeight: targetTimestamp.add(-1, 'hours').toNumber(),
          }),
          indexerState({
            indexerId: 'circulating_supply_indexer::i',
            safeHeight: targetTimestamp.add(-10, 'days').toNumber(),
          }),
        ]),
    })

    const dataStatusService = new DataStatusService(
      mockDatabase({
        indexerState: indexerStateRepository,
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    const result = await dataStatusService.getAmountsStatus(
      [
        escrow('a', 'chain'),
        escrow('b', 'chain'),
        escrow('c', 'chain'),
        escrow('d', 'chain'),
        escrow('e', 'chain'),
        escrow('f', 'chain'),
        circulating('g', 'g'),
        circulating('h', 'h'),
        circulating('i', 'i'),
        circulating('j', 'j'),
        preminted('k', 'k', EthereumAddress.unsafe('k')),
        preminted('l', 'l', EthereumAddress.unsafe('l')),
        preminted('m', 'm', EthereumAddress.unsafe('m')),
        preminted('n', 'n', EthereumAddress.unsafe('n')),
      ],
      targetTimestamp,
    )

    expect(result.excluded).toEqual(
      new Set(['a', 'e', 'f', 'i', 'j', 'm', 'n']),
    )

    expect(result.lagging).toEqualUnsorted([
      {
        id: 'd',
        latestTimestamp: targetTimestamp.add(-1, 'hours'),
      },
      {
        id: 'h',
        latestTimestamp: targetTimestamp.add(-1, 'hours'),
      },
      {
        id: 'l',
        latestTimestamp: targetTimestamp.add(-1, 'hours'),
      },
    ])

    expect(
      indexerConfigurationsRepository.getByConfigurationIds,
    ).toHaveBeenOnlyCalledWith(['a', 'b', 'c', 'd', 'e', 'f'])

    expect(indexerStateRepository.getByIndexerIds).toHaveBeenNthCalledWith(1, [
      'preminted_indexer::k_k',
      'preminted_indexer::l_l',
      'preminted_indexer::m_m',
      'preminted_indexer::n_n',
    ])

    expect(indexerStateRepository.getByIndexerIds).toHaveBeenNthCalledWith(2, [
      'circulating_supply_indexer::g',
      'circulating_supply_indexer::h',
      'circulating_supply_indexer::i',
      'circulating_supply_indexer::j',
    ])
  })

  it(DataStatusService.prototype.getConfigurationsStatus.name, async () => {
    const targetTimestamp = UnixTime.now()

    const indexerConfigurationsRepository = mockObject<
      Database['indexerConfiguration']
    >({
      getByConfigurationIds: async () => [
        configuration('a', 0, null, null),
        configuration('b', 0, null, targetTimestamp.toNumber()),
        configuration('c', 0, 100, 100),
        configuration('d', 0, 100, targetTimestamp.add(-1, 'hours').toNumber()),
        configuration('e', 0, 100, targetTimestamp.add(-10, 'days').toNumber()),
      ],
    })

    const dataStatusService = new DataStatusService(
      mockDatabase({
        indexerState: mockObject(),
        indexerConfiguration: indexerConfigurationsRepository,
      }),
    )

    const result = await dataStatusService.getConfigurationsStatus(
      [
        escrow('a', 'chain'),
        escrow('b', 'chain'),
        escrow('c', 'chain'),
        escrow('d', 'chain'),
        escrow('e', 'chain'),
        escrow('f', 'chain'),
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

  describe(DataStatusService.prototype.getConfigurations.name, () => {
    it('Query by configuration ids if less than 100 configurations', async () => {
      const entries = [escrow('a', 'chain'), escrow('b', 'chain')]

      const indexerConfigurationsRepository = mockObject<
        Database['indexerConfiguration']
      >({
        getByConfigurationIds: async () => [
          configuration('a', 0, null, null),
          configuration('b', 0, null, null),
        ],
      })

      const dataStatusService = new DataStatusService(
        mockDatabase({
          indexerConfiguration: indexerConfigurationsRepository,
        }),
      )

      const result = await dataStatusService.getConfigurations(entries)

      expect(result).toEqual([
        configuration('a', 0, null, null),
        configuration('b', 0, null, null),
      ])

      expect(
        indexerConfigurationsRepository.getByConfigurationIds,
      ).toHaveBeenOnlyCalledWith(['a', 'b'])
    })

    it('Query by indexer id if more than 100 configurations', async () => {
      const entries = [
        [...Array(50)].map((_) => escrow('a', 'chain-a')),
        [...Array(50)].map((_) => totalSupply('b', 'chain-b')),
        [...Array(50)].map((_) => price('c', 'coingecko-id')),
      ].flat()

      const indexerConfigurationsRepository = mockObject<
        Database['indexerConfiguration']
      >({
        getByIndexerIds: async () => [
          configuration('a', 0, null, null),
          configuration('b', 0, null, null),
          configuration('c', 0, null, null),
          configuration('d', 0, null, null), // should be filtered out
        ],
        getByConfigurationIds: mockFn(),
      })

      const dataStatusService = new DataStatusService(
        mockDatabase({
          indexerConfiguration: indexerConfigurationsRepository,
        }),
      )

      const result = await dataStatusService.getConfigurations(entries)

      expect(result).toEqual([
        configuration('a', 0, null, null),
        configuration('b', 0, null, null),
        configuration('c', 0, null, null),
      ])

      expect(
        indexerConfigurationsRepository.getByIndexerIds,
      ).toHaveBeenOnlyCalledWith([
        `chain_amount_indexer::chain-a`,
        `chain_amount_indexer::chain-b`,
        `price_indexer::coingecko-id`,
      ])

      expect(
        indexerConfigurationsRepository.getByConfigurationIds,
      ).not.toHaveBeenCalled()
    })
  })
})

function escrow(configId: string, chain: string) {
  return mockObject<EscrowEntry & { configId: string }>({
    configId,
    type: 'escrow',
    chain,
  })
}

function totalSupply(configId: string, chain: string) {
  return mockObject<TotalSupplyEntry & { configId: string }>({
    configId,
    type: 'totalSupply',
    chain,
  })
}

function preminted(configId: string, chain: string, address: EthereumAddress) {
  return mockObject<PremintedEntry & { configId: string }>({
    configId,
    type: 'preminted',
    chain,
    address,
  })
}

function circulating(configId: string, coingeckoId: string) {
  return mockObject<CirculatingSupplyEntry & { configId: string }>({
    configId,
    type: 'circulatingSupply',
    coingeckoId: CoingeckoId(coingeckoId),
  })
}

function price(configId: string, coingeckoId: string) {
  return mockObject<CoingeckoPriceConfigEntry & { configId: string }>({
    configId,
    type: 'coingecko',
    coingeckoId: CoingeckoId(coingeckoId),
  })
}

function indexerState(v: Partial<IndexerStateRecord>): IndexerStateRecord {
  return {
    indexerId: 'indexer',
    safeHeight: 1,
    configHash: '0x123456',
    minTimestamp: UnixTime.ZERO,
    ...v,
  }
}

function configuration(
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
