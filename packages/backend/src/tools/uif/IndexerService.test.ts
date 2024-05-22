import { UnixTime, json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerService } from './IndexerService'
import {
  IndexerStateRecord,
  IndexerStateRepository,
} from './IndexerStateRepository'

describe(IndexerService.name, () => {
  it(IndexerService.prototype.getSafeHeight.name, async () => {
    const safeHeight = 123
    const indexerStateRepository = mockObject<IndexerStateRepository>({
      findIndexerState: async () => mock({ safeHeight }),
    })

    const indexerService = new IndexerService(
      indexerStateRepository,
      mockObject<IndexerConfigurationRepository>({}),
    )

    const result = await indexerService.getSafeHeight('indexer')

    expect(result).toEqual(safeHeight)
    expect(indexerStateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.setSafeHeight.name, async () => {
    const indexerStateRepository = mockObject<IndexerStateRepository>({
      setSafeHeight: async () => 1,
    })

    const indexerService = new IndexerService(
      indexerStateRepository,
      mockObject<IndexerConfigurationRepository>({}),
    )

    await indexerService.setSafeHeight('indexer', 123)
    expect(indexerStateRepository.setSafeHeight).toHaveBeenOnlyCalledWith(
      'indexer',
      123,
    )
  })

  it(IndexerService.prototype.getConfigHash.name, async () => {
    const configHash = '0x123456'
    const indexerStateRepository = mockObject<IndexerStateRepository>({
      findIndexerState: async () => mock({ configHash }),
    })

    const indexerService = new IndexerService(
      indexerStateRepository,
      mockObject<IndexerConfigurationRepository>({}),
    )

    const result = await indexerService.getConfigHash('indexer')

    expect(result).toEqual(configHash)
    expect(indexerStateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.setConfigHash.name, async () => {
    const indexerStateRepository = mockObject<IndexerStateRepository>({
      setConfigHash: async () => 1,
    })

    const indexerService = new IndexerService(
      indexerStateRepository,
      mockObject<IndexerConfigurationRepository>({}),
    )

    await indexerService.setConfigHash('indexer', '0x123')
    expect(indexerStateRepository.setConfigHash).toHaveBeenOnlyCalledWith(
      'indexer',
      '0x123',
    )
  })

  it(IndexerService.prototype.upsertConfigurations.name, async () => {
    const indexerConfigurationsRepository =
      mockObject<IndexerConfigurationRepository>({
        addOrUpdateMany: async () => -1,
      })

    const indexerService = new IndexerService(
      mockObject<IndexerStateRepository>({}),
      indexerConfigurationsRepository,
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
    const indexerConfigurationsRepository =
      mockObject<IndexerConfigurationRepository>({
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
      mockObject<IndexerStateRepository>({}),
      indexerConfigurationsRepository,
    )

    const result = await indexerService.getSavedConfigurations(
      'indexer',
      (blob: string) => JSON.parse(blob),
    )

    expect(result).toEqualUnsorted([
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
    ])
  })

  it(IndexerService.prototype.updateSavedConfigurations.name, async () => {
    const indexerConfigurationsRepository =
      mockObject<IndexerConfigurationRepository>({
        updateSavedConfigurations: async () => -1,
      })

    const indexerService = new IndexerService(
      mockObject<IndexerStateRepository>({}),
      indexerConfigurationsRepository,
    )

    await indexerService.updateSavedConfigurations('indexer', ['a', 'b'], 123)

    expect(
      indexerConfigurationsRepository.updateSavedConfigurations,
    ).toHaveBeenOnlyCalledWith('indexer', ['a', 'b'], 123)
  })

  it(IndexerService.prototype.persistOnlyUsedConfigurations.name, async () => {
    const indexerConfigurationsRepository =
      mockObject<IndexerConfigurationRepository>({
        deleteConfigurationsExcluding: async () => -1,
      })

    const indexerService = new IndexerService(
      mockObject<IndexerStateRepository>({}),
      indexerConfigurationsRepository,
    )

    await indexerService.persistOnlyUsedConfigurations('indexer', ['a', 'b'])

    expect(
      indexerConfigurationsRepository.deleteConfigurationsExcluding,
    ).toHaveBeenOnlyCalledWith('indexer', ['a', 'b'])
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
