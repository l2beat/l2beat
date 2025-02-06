import type {
  AvailDaTrackingConfig,
  CelestiaDaTrackingConfig,
  EthereumDaTrackingConfig,
} from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type { AvailBlob, CelestiaBlob, EthereumBlob } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { DaService } from './DaService'

const MOCK_PROJECT_CONFIGS = [
  {
    id: ProjectId('project-ethereum-1'),
    config: {
      type: 'ethereum',
      inbox: 'ethereum-1-inbox',
      sequencers: ['ethereum-1-seq1', 'ethereum-1-seq1'],
    } as EthereumDaTrackingConfig,
  },
  {
    id: ProjectId('project-ethereum-2'),
    config: {
      type: 'ethereum',
      inbox: 'ethereum-2-inbox',
      sequencers: [],
    } as EthereumDaTrackingConfig,
  },
  {
    id: ProjectId('project-avail-1'),
    config: {
      type: 'avail',
      appId: 'avail-1',
    } as AvailDaTrackingConfig,
  },
  {
    id: ProjectId('project-celestia-1'),
    config: {
      type: 'celestia',
      namespace: 'celestia-1',
    } as CelestiaDaTrackingConfig,
  },
]

describe(DaService.name, () => {
  // biome-ignore lint/suspicious/noFocusedTests: <explanation>
  describe.only(DaService.prototype.processBlobs.name, () => {
    it('should match ethereum blobs', async () => {
      const TIME = UnixTime.now()

      const mockBlobs = [
        // blob matching project-ethereum-1
        {
          type: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-1
        {
          type: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(200),
        } as EthereumBlob,
        // blob matching project-ethereum-2
        {
          type: 'ethereum',
          inbox: 'ethereum-2-inbox',
          sequencer: 'any',
          blockTimestamp: TIME,
          size: BigInt(300),
        } as EthereumBlob,
        // blob not matching any project
        {
          type: 'ethereum',
          inbox: 'any',
          sequencer: 'any',
          size: BigInt(400),
          blockTimestamp: TIME,
        } as EthereumBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const service = new DaService(MOCK_PROJECT_CONFIGS)
      const result = service.processBlobs(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 1000n,
        },
        {
          projectId: 'project-ethereum-1',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-ethereum-2',
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
          appId: 'avail-1',
          blockTimestamp: TIME,
          size: BigInt(100),
        } as AvailBlob,
        // blob not matching any project
        {
          type: 'avail',
          appId: 'any',
          size: BigInt(200),
          blockTimestamp: TIME,
        } as AvailBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const service = new DaService(MOCK_PROJECT_CONFIGS)
      const result = service.processBlobs(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'avail',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-avail-1',
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
          namespace: 'celestia-1',
          blockTimestamp: TIME,
          size: BigInt(100),
        } as CelestiaBlob,
        // blob not matching any project
        {
          type: 'celestia',
          namespace: 'any',
          size: BigInt(200),
          blockTimestamp: TIME,
        } as CelestiaBlob,
      ]

      const mockRecords: DataAvailabilityRecord[] = []

      const service = new DaService(MOCK_PROJECT_CONFIGS)
      const result = service.processBlobs(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'celestia',
          timestamp: TIME.toStartOf('day'),
          totalSize: 300n,
        },
        {
          projectId: 'project-celestia-1',
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
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(100),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on current day
        {
          type: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME,
          size: BigInt(200),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on previous day
        {
          type: 'ethereum',
          inbox: 'ethereum-1-inbox',
          sequencer: 'ethereum-1-seq1',
          blockTimestamp: TIME.add(-1, 'days'),
          size: BigInt(300),
        } as EthereumBlob,
        // blob matching project-ethereum-1 on next day
        {
          type: 'ethereum',
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
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 10000n,
        },
        // project record for previous day
        {
          projectId: 'project-ethereum-1',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 1000n,
        },
        // ethereum record for current day
        {
          projectId: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 10000n,
        },
        // project record for current day
        {
          projectId: 'project-ethereum-1',
          timestamp: TIME.toStartOf('day'),
          totalSize: 1000n,
        },
      ]

      const service = new DaService(MOCK_PROJECT_CONFIGS)
      const result = service.processBlobs(mockBlobs, mockRecords)

      expect(result).toEqual([
        {
          projectId: 'ethereum',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 10300n, // 10 000 + 300
        },

        {
          projectId: 'project-ethereum-1',
          timestamp: TIME.toStartOf('day').add(-1, 'days'),
          totalSize: 1300n, // 1 000 + 300
        },

        {
          projectId: 'ethereum',
          timestamp: TIME.toStartOf('day'),
          totalSize: 10300n, // 10 000 + 100 + 200
        },

        {
          projectId: 'project-ethereum-1',
          timestamp: TIME.toStartOf('day'),
          totalSize: 1300n, // 1 000 + 100 + 200
        },

        {
          projectId: 'ethereum',
          timestamp: TIME.toStartOf('day').add(1, 'days'),
          totalSize: 400n,
        },

        {
          projectId: 'project-ethereum-1',
          timestamp: TIME.toStartOf('day').add(1, 'days'),
          totalSize: 400n,
        },
      ])
    })
  })
})
