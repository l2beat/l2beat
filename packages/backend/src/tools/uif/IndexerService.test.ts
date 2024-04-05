import { json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerService } from './IndexerService'
import { IndexerStateRepository } from './IndexerStateRepository'

describe(IndexerService.name, () => {
  describe(IndexerService.prototype.setSafeHeight.name, () => {
    it('sets safe height', async () => {
      const indexerStateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => ({
          indexerId: 'indexer',
          safeHeight: 1,
        }),
        setSafeHeight: async () => -1,
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
    it('adds record if there is no entry in the DB', async () => {
      const indexerStateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
        add: async () => '',
      })

      const indexerService = new IndexerService(
        indexerStateRepository,
        mockObject<IndexerConfigurationRepository>({}),
      )

      await indexerService.setSafeHeight('indexer', 123)

      expect(indexerStateRepository.add).toHaveBeenOnlyCalledWith({
        indexerId: 'indexer',
        safeHeight: 123,
      })
    })
  })

  it(IndexerService.prototype.getSafeHeight.name, async () => {
    const indexerStateRepository = mockObject<IndexerStateRepository>({
      findIndexerState: async () => undefined,
    })

    const indexerService = new IndexerService(
      indexerStateRepository,
      mockObject<IndexerConfigurationRepository>({}),
    )

    await indexerService.getSafeHeight('indexer')

    expect(indexerStateRepository.findIndexerState).toHaveBeenOnlyCalledWith(
      'indexer',
    )
  })

  it(IndexerService.prototype.addSavedConfigurations.name, async () => {
    const indexerConfigurationsRepository =
      mockObject<IndexerConfigurationRepository>({
        addManySavedConfigurations: async () => -1,
      })

    const indexerService = new IndexerService(
      mockObject<IndexerStateRepository>({}),
      indexerConfigurationsRepository,
    )

    await indexerService.addSavedConfigurations(
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
      indexerConfigurationsRepository.addManySavedConfigurations,
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

  it(IndexerService.prototype.updateSavedConfigurations.name, async () => {})

  it(IndexerService.prototype.deleteSavedConfigurations.name, async () => {})
})
