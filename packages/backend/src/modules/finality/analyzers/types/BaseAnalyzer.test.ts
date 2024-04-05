import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { BaseAnalyzer, Transaction } from './BaseAnalyzer'

describe(BaseAnalyzer.name, () => {
  describe(BaseAnalyzer.prototype.getFinalityForInterval.name, () => {
    it('calls getFinality for each transaction from the interval', async () => {
      const now = UnixTime.now()

      const mockTxs: Transaction[] = [
        { txHash: 'tx1', timestamp: now },
        { txHash: 'tx2', timestamp: now.add(1, 'hours') },
      ]
      const mockProvider = mockObject<RpcClient>({})
      const mockLivenessRepository = mockObject<LivenessRepository>({
        getTransactionsWithinTimeRange: mockFn().resolvesTo(mockTxs),
      })
      const projectId = ProjectId('projectId')
      const mockTxSubtype = 'batchSubmissions'
      const getFinalitySpy = mockFn((_tx: Transaction) => {})
      const mockAnalyzer = new MockAnalyzer(
        mockProvider,
        mockLivenessRepository,
        projectId,
        getFinalitySpy,
        mockTxSubtype,
      )

      expect(
        await mockAnalyzer.getFinalityForInterval(now, now.add(10, 'hours')),
      ).toEqual([1, 1])
      expect(
        mockLivenessRepository.getTransactionsWithinTimeRange,
      ).toHaveBeenCalledWith(
        projectId,
        mockTxSubtype,
        now,
        now.add(10, 'hours'),
      )
      expect(getFinalitySpy).toHaveBeenCalledTimes(2)
      expect(getFinalitySpy).toHaveBeenCalledWith(mockTxs[0])
      expect(getFinalitySpy).toHaveBeenCalledWith(mockTxs[1])
    })
  })
})

class MockAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    livenessRepository: LivenessRepository,
    projectId: ProjectId,
    private readonly getFinalitySpy: (tx: Transaction) => void,
    private readonly txSubtype:
      | 'batchSubmissions'
      | 'stateUpdates'
      | 'proofSubmissions',
  ) {
    super(provider, livenessRepository, projectId)
  }

  async getFinality(tx: Transaction) {
    this.getFinalitySpy(tx)
    return [1]
  }

  override getTrackedTxSubtype() {
    return this.txSubtype
  }
}
