import type { DataAvailabilityRecord } from '@l2beat/database'
import type { AvailBlob, CelestiaBlob, EthereumBlob } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DaTrackingConfig } from '../../../config/Config'
import { DaService } from './DaService'

const MOCK_ETHEREUM_CONFIGS = [
  {
    type: 'baseLayer' as const,
    daLayer: ProjectId('ethereum'),
    projectId: ProjectId('ethereum'),
    sinceBlock: 0,
  },
  {
    type: 'ethereum' as const,
    daLayer: ProjectId('ethereum'),
    projectId: ProjectId('project-ethereum-1'),
    inbox: 'ethereum-1-inbox',
    sequencers: ['Ethereum-1-seq1', 'ethereum-1-seq1'],
    sinceBlock: 0,
  },
  {
    type: 'ethereum' as const,
    daLayer: ProjectId('ethereum'),
    projectId: ProjectId('project-ethereum-2'),
    inbox: 'Ethereum-2-inbox',
    sequencers: [],
    sinceBlock: 0,
  },
]

const MOCK_CELESTIA_CONFIGS = [
  {
    type: 'baseLayer' as const,
    projectId: ProjectId('celestia'),
    daLayer: ProjectId('celestia'),
    sinceBlock: 0,
  },
  {
    type: 'celestia' as const,
    daLayer: ProjectId('celestia'),
    projectId: ProjectId('project-celestia-1'),
    namespace: 'celestia-1',
    sinceBlock: 0,
  },
]

const MOCK_AVAIL_CONFIGS = [
  {
    type: 'baseLayer' as const,
    projectId: ProjectId('avail'),
    daLayer: ProjectId('avail'),
    sinceBlock: 0,
  },
  {
    type: 'avail' as const,
    daLayer: ProjectId('avail'),
    projectId: ProjectId('project-avail-1'),
    appId: 'avail-1',
    sinceBlock: 0,
  },
]

const MOCK_CONFIGURATIONS: DaTrackingConfig[] = [
  ...MOCK_ETHEREUM_CONFIGS,
  ...MOCK_CELESTIA_CONFIGS,
  ...MOCK_AVAIL_CONFIGS,
]

describe(DaService.name, () => {
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
          blockTimestamp: TIME,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-1
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(200),
        } as EthereumBlob,
        // blob matching project-ethereum-2
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-2-inbox',
          sequencer: 'any',
          blockTimestamp: TIME,
          size: BigInt(300),
        } as EthereumBlob,
        // blob not matching any project
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'any',
          sequencer: 'any',
          size: BigInt(400),
          blockTimestamp: TIME,
        } as EthereumBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const service = new DaService(MOCK_CONFIGURATIONS)
      const result = service.generateRecords(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 1000n,
        },
        {
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-ethereum-2',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
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

      const service = new DaService(MOCK_CONFIGURATIONS)
      const result = service.generateRecords(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'avail',
          daLayer: 'avail',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-avail-1',
          daLayer: 'avail',
          timestamp: TIME.toStartOf('day'),
          totalSize: 100n,
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

      const service = new DaService(MOCK_CONFIGURATIONS)
      const result = service.generateRecords(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'celestia',
          daLayer: 'celestia',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-celestia-1',
          daLayer: 'celestia',
          timestamp: TIME.toStartOf('day'),
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

      const service = new DaService(MOCK_CONFIGURATIONS)
      const result = service.generateRecords(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'avail',
          daLayer: 'avail',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-avail-1',
          daLayer: 'avail',
          timestamp: TIME.toStartOf('day'),
          totalSize: 100n,
        },
      ])
    })

    it('should aggregate per day and merge with existing records', async () => {
      const TIME = UnixTime.now()

      const mockBlobs = [
        // blob matching project-ethereum-1 on current day
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on current day
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(200),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on previous day
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME.add(-1, 'days'),
          size: BigInt(300),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on next day
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME.add(1, 'days'),
          size: BigInt(400),
        } as EthereumBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = [
        // ethereum record for previous day
        {
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 10000n,
        },
        // project record for previous day
        {
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 1000n,
        },
        // ethereum record for current day
        {
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 10000n,
        },
        // project record for current day
        {
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 1000n,
        },
      ]

      const service = new DaService(MOCK_CONFIGURATIONS)
      const result = service.generateRecords(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 10300n, // 10 000 + 300
        },

        {
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 1300n, // 1 000 + 300
        },

        {
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 10300n, // 10 000 + 100 + 200
        },

        {
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 1300n, // 1 000 + 100 + 200
        },

        {
          projectId: 'ethereum',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day').add(1, 'days'),
          totalSize: 400n,
        },

        {
          projectId: 'project-ethereum-1',
          daLayer: 'ethereum',
          timestamp: TIME.toStartOf('day').add(1, 'days'),
          totalSize: 400n,
        },
      ])
    })
  })
})
