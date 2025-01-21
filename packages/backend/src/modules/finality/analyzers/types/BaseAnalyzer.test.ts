import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type {
  Database,
  IndexerConfigurationRecord,
  LivenessRecord,
} from '@l2beat/database'
import { type RpcClient, createTrackedTxId } from '@l2beat/shared'
import { mean } from 'lodash'
import {
  BaseAnalyzer,
  type Batch,
  type L2Block,
  type Transaction,
  batchesToStateUpdateDelays,
} from './BaseAnalyzer'

describe(BaseAnalyzer.name, () => {
  describe(BaseAnalyzer.prototype.analyzeInterval.name, () => {
    it('calls analyze for each transaction from the interval', async () => {
      const now = UnixTime.now()

      const mockConfigurationId = createTrackedTxId.random()
      const mockLivenessRecords: LivenessRecord[] = [
        mockObject<LivenessRecord>({
          configurationId: mockConfigurationId,
          txHash: 'tx3',
          timestamp: now.add(-1, 'hours'),
        }),
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
      ).toEqual([
        {
          l1Timestamp: now.toNumber(),
          l2Blocks: [{ blockNumber: 2, timestamp: 1 }],
        },
        {
          l1Timestamp: now.add(1, 'hours').toNumber(),
          l2Blocks: [{ blockNumber: 2, timestamp: 1 }],
        },
      ])
      expect(
        mockLivenessRepository.getByConfigurationIdWithinTimeRange,
      ).toHaveBeenCalledWith(
        [mockConfigurationId],
        now.add(-1, 'days'),
        now.add(10, 'hours'),
      )
      expect(getFinalitySpy).toHaveBeenCalledTimes(2)
      expect(getFinalitySpy).toHaveBeenCalledWith({
        txHash: mockLivenessRecords[1].txHash,
        timestamp: mockLivenessRecords[1].timestamp,
      })
      expect(getFinalitySpy).toHaveBeenCalledWith({
        txHash: mockLivenessRecords[2].txHash,
        timestamp: mockLivenessRecords[2].timestamp,
      })
    })
  })
})

describe(batchesToStateUpdateDelays.name, () => {
  it('simple example', () => {
    const t2iBatches: Batch[] = [
      {
        l1Timestamp: 7,
        l2Blocks: [
          { blockNumber: 0, timestamp: 0 },
          { blockNumber: 1, timestamp: 2 },
          { blockNumber: 2, timestamp: 4 },
        ],
      },
      {
        l1Timestamp: 15,
        l2Blocks: [
          { blockNumber: 3, timestamp: 6 },
          { blockNumber: 4, timestamp: 8 },
          { blockNumber: 5, timestamp: 10 },
          { blockNumber: 6, timestamp: 12 },
        ],
      },
    ]
    const suBatches: Batch[] = [
      {
        l1Timestamp: 21,
        l2Blocks: [
          { blockNumber: 0, timestamp: 0 },
          { blockNumber: 1, timestamp: 2 },
          { blockNumber: 2, timestamp: 4 },
          { blockNumber: 3, timestamp: 6 },
          { blockNumber: 4, timestamp: 8 },
          { blockNumber: 5, timestamp: 10 },
          { blockNumber: 6, timestamp: 12 },
        ],
      },
    ]

    const result = batchesToStateUpdateDelays(t2iBatches, suBatches)

    expect(mean(result)).toEqual(66 / 7)
  })

  it('fallback to lerp when block missing in t2iBatches', () => {
    const t2iBatches: Batch[] = [
      {
        l1Timestamp: 7,
        l2Blocks: [
          { blockNumber: 0, timestamp: 0 },
          { blockNumber: 1, timestamp: 2 },
          { blockNumber: 2, timestamp: 4 },
        ],
      },
    ]

    const suBatches: Batch[] = [
      {
        l1Timestamp: 21,
        l2Blocks: [
          { blockNumber: 0, timestamp: 0 },
          { blockNumber: 1, timestamp: 2 },
          { blockNumber: 2, timestamp: 4 },
          { blockNumber: 3, timestamp: 6 },
          { blockNumber: 4, timestamp: 8 },
          { blockNumber: 5, timestamp: 10 },
          { blockNumber: 6, timestamp: 12 },
        ],
      },
    ]

    const result = batchesToStateUpdateDelays(t2iBatches, suBatches)

    expect(mean(result)).toEqual(110 / 7)
  })

  it('do not fail if first batch has no l2Blocks', () => {
    const t2iBatches: Batch[] = [
      {
        l1Timestamp: 5,
        l2Blocks: [],
      },
      {
        l1Timestamp: 7,
        l2Blocks: [
          { blockNumber: 0, timestamp: 0 },
          { blockNumber: 1, timestamp: 2 },
          { blockNumber: 2, timestamp: 4 },
        ],
      },
    ]

    const suBatches: Batch[] = [
      {
        l1Timestamp: 21,
        l2Blocks: [
          { blockNumber: 0, timestamp: 0 },
          { blockNumber: 1, timestamp: 2 },
          { blockNumber: 2, timestamp: 4 },
          { blockNumber: 3, timestamp: 6 },
          { blockNumber: 4, timestamp: 8 },
          { blockNumber: 5, timestamp: 10 },
          { blockNumber: 6, timestamp: 12 },
        ],
      },
    ]

    const result = batchesToStateUpdateDelays(t2iBatches, suBatches)

    expect(mean(result)).toEqual(110 / 7)
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

  async analyze(_: Transaction, tx: Transaction): Promise<L2Block[]> {
    this.getFinalitySpy(tx)
    return [{ timestamp: 1, blockNumber: 2 }]
  }

  override getTrackedTxSubtype() {
    return this.txSubtype
  }
}
