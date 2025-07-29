import { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import type { UpdateDiffRepository } from '@l2beat/database/dist/discovery/update-diff/repository'
import type {
  ConfigReader,
  DiscoveryDiff,
  DiscoveryOutput,
  EntryParameters,
  ReceivedPermission,
} from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'
import { UpdateDiffer } from './UpdateDiffer'

describe(UpdateDiffer.name, () => {
  describe(UpdateDiffer.prototype.runForChain.name, () => {
    it('runs for all projects', async () => {
      const chain = 'ethereum'
      const configReader = mockObject<ConfigReader>({
        readAllDiscoveredConfigsForChain: mockFn().returns([
          { name: PROJECT_A, chain },
          { name: PROJECT_B, chain },
        ]),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>(),
        mockObject<DiscoveryOutputCache>(),
        Logger.SILENT,
      )
      const runForProjectMockFn = mockFn().resolvesTo(undefined)
      updateDiffer.runForProject = runForProjectMockFn

      await updateDiffer.runForChain(chain, UnixTime.now())

      expect(
        configReader.readAllDiscoveredConfigsForChain,
      ).toHaveBeenCalledWith(chain)
      expect(runForProjectMockFn).toHaveBeenNthCalledWith(
        1,
        PROJECT_A,
        chain,
        UnixTime.now(),
      )
      expect(runForProjectMockFn).toHaveBeenNthCalledWith(
        2,
        PROJECT_B,
        chain,
        UnixTime.now(),
      )
    })

    it('throws if projectConfig chain mismatch', async () => {
      const chain = 'ethereum'
      const configReader = mockObject<ConfigReader>({
        readAllDiscoveredConfigsForChain: mockFn().returns([
          { name: PROJECT_A, chain: 'arbitrum' },
        ]),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>(),
        mockObject<DiscoveryOutputCache>(),
        Logger.SILENT,
      )

      expect(
        async () => await updateDiffer.runForChain(chain, UnixTime.now()),
      ).toBeRejected()
    })
  })

  describe(UpdateDiffer.prototype.runForProject.name, () => {
    it('should insert update diffs', async () => {
      const updateDiffRepository = mockObject<UpdateDiffRepository>({
        insertMany: async () => 0,
        deleteByProjectAndChain: async () => {},
      })
      const dbTransaction = mockFn(async (fun) => await fun())

      const updateDiffer = new UpdateDiffer(
        mockObject<ConfigReader>({
          readDiscovery: mockFn().returns(mockProject),
        }),
        mockObject<Database>({
          transaction: dbTransaction,
          updateDiff: updateDiffRepository,
        }),
        mockObject<DiscoveryOutputCache>({
          get: mockFn().returns({ entries: [] }),
        }),
        Logger.SILENT,
      )
      const updateDiffs: UpdateDiffRecord[] = [
        {
          address: EthereumAddress.random(),
          type: 'implementationChange',
          chain: 'ethereum',
          projectId: PROJECT_A,
          timestamp: UnixTime.now(),
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
        {
          address: EthereumAddress.random(),
          type: 'highSeverityFieldChange',
          chain: 'ethereum',
          projectId: PROJECT_A,
          timestamp: UnixTime.now(),
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
        {
          address: EthereumAddress.random(),
          type: 'ultimateUpgraderChange',
          chain: 'ethereum',
          projectId: PROJECT_A,
          timestamp: UnixTime.now(),
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
      ]
      updateDiffer.getUpdateDiffs = mockFn().returns(updateDiffs)

      await updateDiffer.runForProject(PROJECT_A, 'ethereum', UnixTime.now())

      expect(dbTransaction).toHaveBeenCalled()
      expect(updateDiffRepository.deleteByProjectAndChain).toHaveBeenCalledWith(
        PROJECT_A,
        'ethereum',
      )
      expect(updateDiffRepository.insertMany).toHaveBeenCalledWith(updateDiffs)
    })

    it('should not insert update diffs if there are no changes', async () => {
      const updateDiffRepository = mockObject<UpdateDiffRepository>({
        insertMany: async () => 0,
        deleteByProjectAndChain: async () => {},
      })

      const updateDiffer = new UpdateDiffer(
        mockObject<ConfigReader>({
          readDiscovery: mockFn().returns(mockProject),
        }),
        mockObject<Database>({
          updateDiff: updateDiffRepository,
        }),
        mockObject<DiscoveryOutputCache>({
          get: mockFn().returns({ entries: [] }),
        }),
        Logger.SILENT,
      )
      updateDiffer.getUpdateDiffs = mockFn().returns([])

      await updateDiffer.runForProject(PROJECT_A, 'ethereum', UnixTime.now())

      expect(updateDiffRepository.deleteByProjectAndChain).toHaveBeenCalledWith(
        PROJECT_A,
        'ethereum',
      )
      expect(updateDiffRepository.insertMany).not.toHaveBeenCalled()
    })

    it('should skip if on disk discovery is newer', async () => {
      const updateDiffRepository = mockObject<UpdateDiffRepository>({
        insertMany: async () => 0,
        deleteByProjectAndChain: async () => {},
      })
      const dbTransaction = mockFn(async (fun) => await fun())

      const updateDiffer = new UpdateDiffer(
        mockObject<ConfigReader>({
          readDiscovery: mockFn().returns({
            ...mockProject,
            timestamp: 2,
          }),
        }),
        mockObject<Database>({
          transaction: dbTransaction,
          updateDiff: updateDiffRepository,
        }),
        mockObject<DiscoveryOutputCache>({
          get: mockFn().returns({ entries: [], timestamp: 1 }),
        }),
        Logger.SILENT,
      )

      const getUpdateDiffsMock = mockFn()
      updateDiffer.getUpdateDiffs = getUpdateDiffsMock

      await updateDiffer.runForProject(PROJECT_A, 'ethereum', UnixTime.now())

      expect(dbTransaction).not.toHaveBeenCalled()
      expect(getUpdateDiffsMock).not.toHaveBeenCalled()
      expect(
        updateDiffRepository.deleteByProjectAndChain,
      ).not.toHaveBeenCalled()
      expect(updateDiffRepository.insertMany).not.toHaveBeenCalled()
    })
  })

  describe(UpdateDiffer.prototype.getUpdateDiffs.name, () => {
    it('detects implementation changes', () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().returns(mockProject),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>({}),
        mockObject<DiscoveryOutputCache>(),
        Logger.SILENT,
      )
      const timestamp = UnixTime.now()
      const diff: DiscoveryDiff = {
        address: EthereumAddress.random(),
        addressType: 'Contract',
        diff: [
          {
            key: 'values.$implementation',
          },
        ],
      }

      const result = updateDiffer.getUpdateDiffs(
        [diff],
        mockObject<EntryParameters[]>(),
        PROJECT_A,
        'ethereum',
        timestamp,
        123,
        456,
      )

      expect(result).toEqual([
        {
          address: diff.address,
          type: 'implementationChange',
          chain: 'ethereum',
          projectId: PROJECT_A,
          timestamp,
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
      ])
    })

    it('detects high severity field changes', () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().returns(mockProject),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>({}),
        mockObject<DiscoveryOutputCache>(),
        Logger.SILENT,
      )
      const timestamp = UnixTime.now()
      const diff: DiscoveryDiff = {
        address: EthereumAddress.random(),
        addressType: 'Contract',
        diff: [
          {
            key: 'SOME-HIGH-SEVERITY-FIELD',
            severity: 'HIGH',
          },
        ],
      }

      const result = updateDiffer.getUpdateDiffs(
        [diff],
        mockObject<EntryParameters[]>(),
        PROJECT_A,
        'ethereum',
        timestamp,
        123,
        456,
      )

      expect(result).toEqual([
        {
          address: diff.address,
          type: 'highSeverityFieldChange',
          chain: 'ethereum',
          projectId: PROJECT_A,
          timestamp,
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
      ])
    })

    it('detects upgrade changes', () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().returns(mockProject),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>({}),
        mockObject<DiscoveryOutputCache>(),
        Logger.SILENT,
      )
      const timestamp = UnixTime.now()
      const address = EthereumAddress.random()
      const diff: DiscoveryDiff = {
        address,
        addressType: 'Contract',
        diff: [
          {
            key: 'receivedPermissions.2',
          },
        ],
      }

      const latestDiscovery = mockObject<DiscoveryOutput>({
        entries: [
          mockObject<EntryParameters>({
            address: ChainSpecificAddress.from('eth', address),
            receivedPermissions: [
              mockObject<ReceivedPermission>(),
              mockObject<ReceivedPermission>(),
              mockObject<ReceivedPermission>({
                permission: 'upgrade',
              }),
            ],
          }),
        ],
      })

      const result = updateDiffer.getUpdateDiffs(
        [diff],
        latestDiscovery.entries,
        PROJECT_A,
        'ethereum',
        timestamp,
        123,
        456,
      )

      expect(result).toEqual([
        {
          address,
          type: 'ultimateUpgraderChange',
          chain: 'ethereum',
          projectId: PROJECT_A,
          timestamp,
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
      ])
    })
  })

  describe(UpdateDiffer.prototype.getOnDiskDiscovery.name, () => {
    it('should read config from disk', () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().returns(undefined),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>({}),
        mockObject<DiscoveryOutputCache>(),
        Logger.SILENT,
      )

      updateDiffer.getOnDiskDiscovery({
        name: PROJECT_A,
        chain: 'ethereum',
      })

      expect(configReader.readDiscovery).toHaveBeenCalledWith(
        PROJECT_A,
        'ethereum',
      )
    })
  })
})

const PROJECT_A = 'project-a'
const PROJECT_B = 'project-b'
const NAME_A = 'contract-a'
const ADDRESS_A = EthereumAddress.random()
const NAME_B = 'contract-b'
const ADDRESS_B = EthereumAddress.random()
const ADDRESS_C = EthereumAddress.random()

const COMMITTED: EntryParameters[] = [
  {
    ...mockContract(NAME_A, ADDRESS_A),
    values: { a: true },
  },
  {
    ...mockContract(NAME_B, ADDRESS_B),
    values: {
      $implementation: ADDRESS_C,
    },
  },
]

const mockProject: DiscoveryOutput = {
  name: PROJECT_A,
  chain: 'ethereum',
  timestamp: 1,
  configHash: Hash256.random(),
  entries: COMMITTED,
  abis: {},
  usedTemplates: {},
  usedBlockNumbers: {},
}

function mockContract(name: string, address: EthereumAddress): EntryParameters {
  return {
    type: 'Contract',
    name,
    address: ChainSpecificAddress.from('eth', address),
    values: {
      $immutable: true,
    },
  }
}
