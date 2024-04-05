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

  it(IndexerService.prototype.addSavedConfigurations.name, async () => {})

  it(IndexerService.prototype.getSavedConfigurations.name, async () => {})

  it(IndexerService.prototype.updateSavedConfigurations.name, async () => {})

  it(IndexerService.prototype.deleteSavedConfigurations.name, async () => {})
})
