import type { DataAvailabilityRecord } from '@l2beat/database'
import type { AvailBlob, CelestiaBlob, EthereumBlob } from '@l2beat/shared'
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

      expect(result).toEqual([
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 1100n,
        },
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 400n,
        },
        {
          configurationId: 'eth-3',
          projectId: 'project-ethereum-2',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 300n,
        },
      ])
    })

    it('should match celestia blobs', async () => {
      const TIME = UnixTime.now()

      const mockBlobs = [
        // blob matching avail project-avail-1
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'celestia-1',
          blockTimestamp: TIME,
          blockNumber: 1,
          size: BigInt(100),
        } as CelestiaBlob,
        // blob not matching any project
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'any',
          size: BigInt(200),
          blockTimestamp: TIME,
        } as CelestiaBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const result = service.generateRecords(
        mockBlobs,
        mockRecords,
        MOCK_CELESTIA_CONFIGS,
      )

      expect(result).toEqual([
        {
          configurationId: 'cel-1',
          projectId: 'celestia',
          daLayer: 'celestia',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 300n,
        },
        {
          configurationId: 'cel-2',
          projectId: 'project-celestia-1',
          daLayer: 'celestia',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 100n,
        },
      ])
    })

    it('should match avail blobs', async () => {
      const TIME = UnixTime.now()

      const mockBlobs = [
        // blob matching avail project-avail-1
        {
          type: 'avail',
          daLayer: 'avail',
          appId: 'avail-1',
          blockTimestamp: TIME,
          size: BigInt(100),
        } as AvailBlob,
        // blob not matching any project
        {
          type: 'avail',
          daLayer: 'avail',
          appId: 'any',
          size: BigInt(200),
          blockTimestamp: TIME,
        } as AvailBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const result = service.generateRecords(
        mockBlobs,
        mockRecords,
        MOCK_AVAIL_CONFIGS,
      )

      expect(result).toEqual([
        {
          configurationId: 'av-1',
          projectId: 'avail',
          daLayer: 'avail',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 300n,
        },
        {
          configurationId: 'av-2',
          projectId: 'project-avail-1',
          daLayer: 'avail',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 100n,
        },
      ])
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
        },
        // project record for previous hour
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
          totalSize: 1000n,
        },
        // ethereum record for current hour
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 10000n,
        },
        // project record for current hour
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 1000n,
        },
      ]

      const result = service.generateRecords(
        mockBlobs,
        mockRecords,
        MOCK_ETHEREUM_CONFIGS,
      )

      expect(result).toEqual([
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
          totalSize: 10300n, // 10 000 + 300
        },
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') - 1 * UnixTime.HOUR,
          totalSize: 1300n, // 1 000 + 300
        },
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 10300n, // 10 000 + 100 + 200
        },
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour'),
          totalSize: 1300n, // 1 000 + 100 + 200
        },
        {
          configurationId: 'eth-1',
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') + 1 * UnixTime.HOUR,
          totalSize: 400n,
        },
        {
          configurationId: 'eth-2',
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: UnixTime.toStartOf(TIME, 'hour') + 1 * UnixTime.HOUR,
          totalSize: 400n,
        },
      ])
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

const MOCK_CELESTIA_CONFIGS: BlockDaIndexedConfig[] = [
  {
    configurationId: 'cel-1',
    type: 'baseLayer' as const,
    projectId: ProjectId('celestia'),
    daLayer: ProjectId('celestia'),
    sinceBlock: 0,
  },
  {
    configurationId: 'cel-2',
    type: 'celestia' as const,
    daLayer: ProjectId('celestia'),
    projectId: ProjectId('project-celestia-1'),
    namespace: 'celestia-1',
    sinceBlock: 0,
  },
]

const MOCK_AVAIL_CONFIGS: BlockDaIndexedConfig[] = [
  {
    configurationId: 'av-1',
    type: 'baseLayer' as const,
    projectId: ProjectId('avail'),
    daLayer: ProjectId('avail'),
    sinceBlock: 0,
  },
  {
    configurationId: 'av-2',
    type: 'avail' as const,
    daLayer: ProjectId('avail'),
    projectId: ProjectId('project-avail-1'),
    appId: 'avail-1',
    sinceBlock: 0,
  },
]
