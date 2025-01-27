import { createAmountId, createPriceId } from '@l2beat/backend-shared'
import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import {
  AssetId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { ValueService } from '../services/ValueService'
import type { SyncOptimizer } from '../utils/SyncOptimizer'
import { MOCKS_FOR_TVL } from '../utils/test/mocks'
import { ValueIndexer } from './ValueIndexer'
import type { ValueIndexerDeps } from './types'

const { priceConfiguration, amountConfiguration, valueRecord } = MOCKS_FOR_TVL

describe(ValueIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(ValueIndexer.prototype.update.name, () => {
    it('skips due to minHeight', async () => {
      const from = 50
      const to = 100
      const indexer = mockIndexer({ minHeight: 200 })

      const safeHeight = await indexer.update(from, to)

      expect(safeHeight).toEqual(to)
    })

    it('skips due to maxHeight', async () => {
      const from = 50
      const to = 100
      const indexer = mockIndexer({ maxHeight: 10 })

      const safeHeight = await indexer.update(from, to)

      expect(safeHeight).toEqual(to)
    })

    it('skips when no timestamps to sync', async () => {
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: () => [],
      })
      const indexer = mockIndexer({ syncOptimizer })

      const from = 50
      const to = 100
      const safeHeight = await indexer.update(from, to)

      expect(safeHeight).toEqual(to)
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        from,
        to,
        MAX_TIMESTAMPS,
      )
    })

    it('considers minHeight and maxHeight when querying for timestamps', async () => {
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: () => [],
      })

      const from = 50
      const minHeight = 100
      const maxHeight = 200
      const to = 300
      const indexer = mockIndexer({ syncOptimizer, minHeight, maxHeight })

      const safeHeight = await indexer.update(from, to)

      expect(safeHeight).toEqual(to)
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        minHeight,
        maxHeight,
        MAX_TIMESTAMPS,
      )
    })

    it('calculates and saves to DB', async () => {
      const timestamps = [new UnixTime(100), new UnixTime(200)]

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: () => timestamps,
      })
      const values = [
        valueRecord({ timestamp: timestamps[0] }),
        valueRecord({ timestamp: timestamps[1] }),
      ]
      const valueService = mockObject<ValueService>({
        calculateTvlForTimestamps: async () => values,
      })
      const valueRepository = mockObject<Database['value']>({
        upsertMany: async () => 1,
      })
      const ADDRESS_A = EthereumAddress.random()
      const ADDRESS_B = EthereumAddress.random()

      const amountConfigs = [
        amountConfiguration({ address: ADDRESS_A }),
        amountConfiguration({ address: ADDRESS_B }),
      ]
      const priceConfigs = [
        priceConfiguration({ address: ADDRESS_A }),
        priceConfiguration({ address: ADDRESS_B }),
      ]

      const indexer = mockIndexer({
        syncOptimizer,
        valueService,
        db: mockObject<Database>({ value: valueRepository }),
        amountConfigs,
        priceConfigs,
      })

      const from = 0
      const to = 1000
      const safeHeight = await indexer.update(from, to)

      expect(safeHeight).toEqual(timestamps[1].toNumber())
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        from,
        to,
        MAX_TIMESTAMPS,
      )
      expect(valueService.calculateTvlForTimestamps).toHaveBeenOnlyCalledWith(
        ProjectId('project'),
        'chain',
        new Map([
          [createAmountId(amountConfigs[0]), amountConfigs[0]],
          [createAmountId(amountConfigs[1]), amountConfigs[1]],
        ]),
        new Map([
          [
            AssetId.create(priceConfigs[0].chain, priceConfigs[0].address),
            createPriceId(priceConfigs[0]),
          ],
          [
            AssetId.create(priceConfigs[1].chain, priceConfigs[1].address),
            createPriceId(priceConfigs[1]),
          ],
        ]),
        timestamps,
      )
      expect(valueRepository.upsertMany).toHaveBeenOnlyCalledWith(values)
    })
  })
})

const MAX_TIMESTAMPS = 100
function mockIndexer(v: Partial<ValueIndexerDeps>) {
  return new ValueIndexer({
    valueService: mockObject<ValueService>(),
    db: mockObject<Database>({ value: mockObject<Database['value']>() }),
    priceConfigs: [],
    amountConfigs: [],
    project: ProjectId('project'),
    dataSource: 'chain',
    syncOptimizer: mockObject<SyncOptimizer>(),
    maxTimestampsToProcessAtOnce: MAX_TIMESTAMPS,
    minHeight: 0,
    maxHeight: Infinity,
    parents: [],
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    ...v,
  })
}
