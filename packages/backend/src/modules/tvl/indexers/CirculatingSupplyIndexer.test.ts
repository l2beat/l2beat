import { Logger } from '@l2beat/backend-tools'
import { AmountRecord, Database } from '@l2beat/database'
import {
  CirculatingSupplyEntry,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createAmountId } from '../utils/createAmountId'
import { CirculatingSupplyIndexer } from './CirculatingSupplyIndexer'

describe(CirculatingSupplyIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(CirculatingSupplyIndexer.prototype.update.name, async () => {
    it('fetches amounts, optimizes and saves nonZero records to DB', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 200

      const amountRepository = mockObject<Database['amount']>({
        insertMany: async () => 1,
      })

      const configuration = mockObject<CirculatingSupplyEntry>({
        chain: 'chain',
        project: ProjectId('project'),
        type: 'circulatingSupply',
        address: EthereumAddress.random(),
        coingeckoId: CoingeckoId('id'),
        category: 'other',
      })

      const circulatingSupplyService = mockObject<CirculatingSupplyService>({
        getAdjustedTo: () => new UnixTime(adjustedTo),
        fetchCirculatingSupplies: async () => [
          { ...amount(configuration, 100), amount: 0n }, // this should be filtered out
          amount(configuration, 150), // this should be filtered out
          amount(configuration, 200),
        ],
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        shouldTimestampBeSynced: (t: UnixTime) => !(t.toNumber() % 100),
      })

      const indexer = new CirculatingSupplyIndexer({
        db: mockObject<Database>({ amount: amountRepository }),
        configuration,
        parents: [],
        circulatingSupplyService,
        syncOptimizer,
        minHeight: 0,
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
      })

      const safeHeight = await indexer.update(from, to)

      expect(circulatingSupplyService.getAdjustedTo).toHaveBeenOnlyCalledWith(
        from,
        to,
      )

      expect(
        circulatingSupplyService.fetchCirculatingSupplies,
      ).toHaveBeenOnlyCalledWith(new UnixTime(from), new UnixTime(adjustedTo), {
        ...configuration,
        id: createAmountId(configuration),
      })

      expect(amountRepository.insertMany).toHaveBeenOnlyCalledWith([
        amount(configuration, 200),
      ])

      expect(safeHeight).toEqual(adjustedTo)
    })
  })

  describe(CirculatingSupplyIndexer.prototype.invalidate.name, () => {
    it('deletes records after target height', async () => {
      const targetHeight = 100

      const configuration = mockObject<CirculatingSupplyEntry>({
        chain: 'chain',
        project: ProjectId('project'),
        type: 'circulatingSupply',
        address: EthereumAddress.random(),
        coingeckoId: CoingeckoId('id'),
        category: 'other',
      })

      const amountRepository = mockObject<Database['amount']>({
        deleteByConfigAfter: async () => 1,
      })

      const indexer = new CirculatingSupplyIndexer({
        db: mockObject<Database>({ amount: amountRepository }),
        configuration,
        parents: [],
        circulatingSupplyService: mockObject<CirculatingSupplyService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        minHeight: 0,
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
      })

      await indexer.invalidate(targetHeight)

      expect(amountRepository.deleteByConfigAfter).toHaveBeenOnlyCalledWith(
        createAmountId(configuration),
        new UnixTime(targetHeight),
      )
    })
  })
})

function amount(
  config: CirculatingSupplyEntry,
  timestamp: number,
): AmountRecord {
  return {
    configId: createAmountId(config),
    timestamp: new UnixTime(timestamp),
    amount: BigInt(timestamp), // for simplicity it equals timestamp
  }
}
