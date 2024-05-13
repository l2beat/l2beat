import { Logger } from '@l2beat/backend-tools'
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
import { AmountRepository } from '../repositories/AmountRepository'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createAmountId } from '../utils/createAmountId'
import { CirculatingSupplyIndexer } from './CirculatingSupplyIndexer'

describe(CirculatingSupplyIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
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
      })

      const amountRepository = mockObject<AmountRepository>({
        deleteByConfigAfter: async () => 1,
      })

      const indexer = new CirculatingSupplyIndexer({
        amountRepository,
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
