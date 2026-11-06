import type { DataAvailabilityRecord } from '@l2beat/database'
import type { EthereumBlob } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { BlockDaIndexedConfig } from '../../../config/Config'
import { DaService } from './DaService'

describe(DaService.name, () => {
  const service = new DaService()

  describe(DaService.prototype.generateRecords.name, () => {
    it('should match ethereum blobs', async () => {
      const TIME = UnixTime.now()

      const mockBlobs = [
        // blob matching project-ethereum-1
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: [],
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-1
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: [],
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(200),
        } as EthereumBlob,
        // blob matching project-ethereum-1 by topic
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: ['0x1234'],
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-2
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-2-inbox',
          sequencer: 'any',
          topics: [],
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(300),
        } as EthereumBlob,
        // blob not matching any project
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'any',
          sequencer: 'any',
          topics: [],
          size: BigInt(400),
          blockTimestamp: TIME,
          blockNumber: 1,
        } as EthereumBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const result = service.generateRecords(
        mockBlobs,
        mockRecords,
        MOCK_ETHEREUM_CONFIGS,
      )

      expect(result).toEqual({
        records: [
          {
            configurationId: 'eth-1',
            projectId: 'ethereum',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour'),
            totalSize: 1100n,
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-2',
            projectId: 'project-ethereum-1',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour'),
            totalSize: 400n,
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-3',
            projectId: 'project-ethereum-2',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour'),
            totalSize: 300n,
            totalFeeEth: null,
          },
        ],
        latestTimestamp: TIME,
      })
    })

    it('should aggregate per hour and merge with existing records', async () => {
      const TIME = UnixTime.now()

      const mockBlobs = [
        // blob matching project-ethereum-1 on current hour
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: [],
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on current hour
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: [],
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(200),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on previous hour
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: [],
          blockTimestamp: TIME - 1 * UnixTime.HOUR,
          blockNumber: 1,
          size: BigInt(300),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on next hour
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          topics: [],
          blockTimestamp: TIME + 1 * UnixTime.HOUR,
          blockNumber: 1,
          size: BigInt(400),
        } as EthereumBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = [
        // ethereum record for previous hour
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
          totalSize: 10000n,
          totalFeeEth: null,
        },
        // project record for previous hour
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
          totalSize: 1000n,
          totalFeeEth: null,
        },
        // ethereum record for current hour
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 10000n,
          totalFeeEth: null,
        },
        // project record for current hour
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 1000n,
          totalFeeEth: null,
        },
      ]

      const result = service.generateRecords(
        mockBlobs,
        mockRecords,
        MOCK_ETHEREUM_CONFIGS,
      )

      expect(result).toEqual({
        records: [
          {
            configurationId: 'eth-1',
            projectId: 'ethereum',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
            totalSize: 10300n, // 10 000 + 300
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-2',
            projectId: 'project-ethereum-1',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
            totalSize: 1300n, // 1 000 + 300
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-1',
            projectId: 'ethereum',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour'),
            totalSize: 10300n, // 10 000 + 100 + 200
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-2',
            projectId: 'project-ethereum-1',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour'),
            totalSize: 1300n, // 1 000 + 100 + 200
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-1',
            projectId: 'ethereum',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour') + 1 * UnixTime.HOUR,
            totalSize: 400n,
            totalFeeEth: null,
          },
          {
            configurationId: 'eth-2',
            projectId: 'project-ethereum-1',
            daLayer: 'ethereum',
            timestamp: UnixTime.toStartOf(TIME, 'hour') + 1 * UnixTime.HOUR,
            totalSize: 400n,
            totalFeeEth: null,
          },
        ],
        latestTimestamp: TIME + 1 * UnixTime.HOUR,
      })
    })
  })
})

const MOCK_ETHEREUM_CONFIGS: BlockDaIndexedConfig[] = [
  {
    configurationId: 'eth-1',
    type: 'baseLayer' as const,
    daLayer: ProjectId('ethereum'),
    projectId: ProjectId('ethereum'),
    sinceBlock: 0,
  },
  {
    configurationId: 'eth-2',
    type: 'ethereum' as const,
    daLayer: ProjectId('ethereum'),
    projectId: ProjectId('project-ethereum-1'),
    inbox: 'ethereum-1-inbox',
    sequencers: ['Ethereum-1-seq1', 'ethereum-1-seq1'],
    sinceBlock: 0,
    topics: ['0x1234', '0x5678'],
  },
  {
    configurationId: 'eth-3',
    type: 'ethereum' as const,
    daLayer: ProjectId('ethereum'),
    projectId: ProjectId('project-ethereum-2'),
    inbox: 'Ethereum-2-inbox',
    sequencers: [],
    sinceBlock: 0,
  },
]

describe(`${DaService.name} fees`, () => {
  const service = new DaService()
  const TIME = UnixTime.toStartOf(UnixTime.now(), 'hour')
  const GWEI = 1_000_000_000n
  const blob = (blockNumber: number, size: bigint): EthereumBlob => ({
    type: 'ethereum',
    daLayer: 'ethereum',
    inbox: 'ethereum-1-inbox',
    sequencer: 'ethereum-1-seq1',
    topics: [],
    blockTimestamp: TIME,
    blockNumber,
    size,
  })

  it('prices every blob at the blob base fee of its block', () => {
    const result = service.generateRecords(
      [blob(1, 131072n), blob(2, 131072n)],
      [],
      MOCK_ETHEREUM_CONFIGS.slice(0, 1),
      new Map([
        [1, GWEI],
        [2, 3n * GWEI],
      ]),
    )

    expect(result.records).toEqual([
      {
        configurationId: 'eth-1',
        projectId: 'ethereum',
        daLayer: 'ethereum',
        timestamp: TIME,
        totalSize: 262144n,
        // 131072 gwei + 3 × 131072 gwei
        totalFeeEth: 0.000524288,
      },
    ])
  })

  it('adds the fees to a record indexed before they were tracked', () => {
    const result = service.generateRecords(
      [blob(1, 131072n)],
      [
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME,
          totalSize: 1000n,
          totalFeeEth: null,
        },
      ],
      MOCK_ETHEREUM_CONFIGS.slice(0, 1),
      new Map([[1, GWEI]]),
    )

    expect(result.records[0]?.totalFeeEth).toEqual(0.000131072)
  })

  it('throws when a block has no blob base fee', () => {
    expect(() =>
      service.generateRecords(
        [blob(1, 131072n)],
        [],
        MOCK_ETHEREUM_CONFIGS.slice(0, 1),
        new Map(),
      ),
    ).toThrow('No blob base fee for the block')
  })
})
