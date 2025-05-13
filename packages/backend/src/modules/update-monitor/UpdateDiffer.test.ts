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
  type ChainConverter,
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { UpdateDiffer } from './UpdateDiffer'

describe(UpdateDiffer.name, () => {
  describe(UpdateDiffer.prototype.run.name, () => {
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
        mockObject<ChainConverter>(),
        Logger.SILENT,
      )
      updateDiffer.getUpdateDiffs = mockFn().returns([])

      await updateDiffer.run(
        PROJECT_A,
        'ethereum',
        mockObject<DiscoveryOutput>({
          entries: [],
        }),
        UnixTime.now(),
      )

      expect(updateDiffRepository.deleteByProjectAndChain).toHaveBeenCalledWith(
        PROJECT_A,
        'ethereum',
      )
      expect(updateDiffRepository.insertMany).not.toHaveBeenCalled()
    })

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
        mockObject<ChainConverter>(),
        Logger.SILENT,
      )
      const updateDiffs: UpdateDiffRecord[] = [
        {
          address: EthereumAddress.random(),
          type: 'implementationChange',
          chain: 'ethereum',
          projectName: PROJECT_A,
          timestamp: UnixTime.now(),
        },
        {
          address: EthereumAddress.random(),
          type: 'highSeverityFieldChange',
          chain: 'ethereum',
          projectName: PROJECT_A,
          timestamp: UnixTime.now(),
        },
        {
          address: EthereumAddress.random(),
          type: 'ultimateUpgraderChange',
          chain: 'ethereum',
          projectName: PROJECT_A,
          timestamp: UnixTime.now(),
        },
      ]
      updateDiffer.getUpdateDiffs = mockFn().returns(updateDiffs)

      await updateDiffer.run(
        PROJECT_A,
        'ethereum',
        mockObject<DiscoveryOutput>({
          entries: [],
        }),
        UnixTime.now(),
      )

      expect(dbTransaction).toHaveBeenCalled()
      expect(updateDiffRepository.deleteByProjectAndChain).toHaveBeenCalledWith(
        PROJECT_A,
        'ethereum',
      )
      expect(updateDiffRepository.insertMany).toHaveBeenCalledWith(updateDiffs)
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
        mockObject<ChainConverter>({
          toChainId: mockFn().returns(ChainId.ETHEREUM),
        }),
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
        mockObject<DiscoveryOutput>(),
        PROJECT_A,
        'ethereum',
        timestamp,
      )

      expect(result).toEqual([
        {
          address: diff.address,
          type: 'implementationChange',
          chain: 'ethereum',
          projectName: PROJECT_A,
          timestamp,
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
        mockObject<ChainConverter>({
          toChainId: mockFn().returns(ChainId.ETHEREUM),
        }),
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
        mockObject<DiscoveryOutput>(),
        PROJECT_A,
        'ethereum',
        timestamp,
      )

      expect(result).toEqual([
        {
          address: diff.address,
          type: 'highSeverityFieldChange',
          chain: 'ethereum',
          projectName: PROJECT_A,
          timestamp,
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
        mockObject<ChainConverter>({
          toChainId: mockFn().returns(ChainId.ETHEREUM),
        }),
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
            address,
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
        latestDiscovery,
        PROJECT_A,
        'ethereum',
        timestamp,
      )

      expect(result).toEqual([
        {
          address,
          type: 'ultimateUpgraderChange',
          chain: 'ethereum',
          projectName: PROJECT_A,
          timestamp,
        },
      ])
    })
  })

  describe(UpdateDiffer.prototype.getPreviousDiscovery.name, () => {
    it('should read config from disk', () => {
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().returns(undefined),
      })

      const updateDiffer = new UpdateDiffer(
        configReader,
        mockObject<Database>({}),
        mockObject<ChainConverter>(),
        Logger.SILENT,
      )

      updateDiffer.getPreviousDiscovery({
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
  blockNumber: 1,
  configHash: Hash256.random(),
  entries: COMMITTED,
  abis: {},
  usedTemplates: {},
}

function mockContract(name: string, address: EthereumAddress): EntryParameters {
  return {
    type: 'Contract',
    name,
    address,
    values: {
      $immutable: true,
    },
  }
}
