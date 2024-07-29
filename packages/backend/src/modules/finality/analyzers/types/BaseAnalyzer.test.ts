import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  Database,
  IndexerConfigurationRecord,
  LivenessRecord,
} from '@l2beat/database'
import { createTrackedTxId } from '@l2beat/shared'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { BaseAnalyzer, Transaction } from './BaseAnalyzer'

describe(BaseAnalyzer.name, () => {
  describe(BaseAnalyzer.prototype.analyzeInterval.name, () => {
    it('calls analyze for each transaction from the interval', async () => {
      const now = UnixTime.now()

      const mockConfigurationId = createTrackedTxId.random()
      const mockLivenessRecords: LivenessRecord[] = [
        mockObject<LivenessRecord>({
          configurationId: mockConfigurationId,
          txHash: 'tx1',
          timestamp: now,
        }),
        mockObject<LivenessRecord>({
          configurationId: mockConfigurationId,
          txHash: 'tx2',
          timestamp: now.add(1, 'hours'),
        }),
      ]

      const mockProjectId = ProjectId('projectId')
      const mockTxSubtype = 'batchSubmissions'

      const mockConfiguration = mockObject<IndexerConfigurationRecord>({
        id: mockConfigurationId,
        properties: JSON.stringify({
          projectId: mockProjectId,
          type: 'liveness',
          subtype: mockTxSubtype,
        }),
      })

      const mockProvider = mockObject<RpcClient>({})
      const mockLivenessRepository = mockObject<Database['liveness']>({
        getByConfigurationIdWithinTimeRange:
          mockFn().resolvesTo(mockLivenessRecords),
      })
      const mockIndexerConfigurationRepository = mockObject<
        Database['indexerConfiguration']
      >({
        getByIndexerId: mockFn().resolvesTo([mockConfiguration]),
      })

      const getFinalitySpy = mockFn((_tx: Transaction) => {})
      const mockAnalyzer = new MockAnalyzer(
        mockProvider,
        mockObject<Database>({
          indexerConfiguration: mockIndexerConfigurationRepository,
          liveness: mockLivenessRepository,
        }),
        mockProjectId,
        getFinalitySpy,
        mockTxSubtype,
      )

      expect(
        await mockAnalyzer.analyzeInterval(now, now.add(10, 'hours')),
      ).toEqual([1, 1])
      expect(
        mockLivenessRepository.getByConfigurationIdWithinTimeRange,
      ).toHaveBeenCalledWith([mockConfigurationId], now, now.add(10, 'hours'))
      expect(getFinalitySpy).toHaveBeenCalledTimes(2)
      expect(getFinalitySpy).toHaveBeenCalledWith({
        txHash: mockLivenessRecords[0].txHash,
        timestamp: mockLivenessRecords[0].timestamp,
      })
      expect(getFinalitySpy).toHaveBeenCalledWith({
        txHash: mockLivenessRecords[1].txHash,
        timestamp: mockLivenessRecords[1].timestamp,
      })
    })
  })
})

class MockAnalyzer extends BaseAnalyzer {
  constructor(
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly getFinalitySpy: (tx: Transaction) => void,
    private readonly txSubtype:
      | 'batchSubmissions'
      | 'stateUpdates'
      | 'proofSubmissions',
  ) {
    super(provider, db, projectId)
  }

  async analyze(tx: Transaction) {
    this.getFinalitySpy(tx)
    return [1]
  }

  override getTrackedTxSubtype() {
    return this.txSubtype
  }
}
