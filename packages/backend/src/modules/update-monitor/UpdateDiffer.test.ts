import { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import type { UpdateDiffRepository } from '@l2beat/database/dist/repositories/UpdateDiffRepository'
import type {
  ConfigReader,
  DiscoveryDiff,
  DiscoveryOutput,
  EntryParameters,
  ReceivedPermission,
} from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'
import { UpdateDiffer } from './UpdateDiffer'

describe(UpdateDiffer.name, () => {
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
          address: ChainSpecificAddress.random(),
          type: 'implementationChange',
          projectId: PROJECT_A,
          timestamp: UnixTime.now(),
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
        {
          address: ChainSpecificAddress.random(),
          type: 'highSeverityFieldChange',
          projectId: PROJECT_A,
          timestamp: UnixTime.now(),
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
        {
          address: ChainSpecificAddress.random(),
          type: 'ultimateUpgraderChange',
          projectId: PROJECT_A,
          timestamp: UnixTime.now(),
          diffBaseTimestamp: 123,
          diffHeadTimestamp: 456,
        },
      ]
      updateDiffer.getUpdateDiffs = mockFn().returns(updateDiffs)

      await updateDiffer.runForProject(PROJECT_A, UnixTime.now())

      expect(dbTransaction).toHaveBeenCalled()
      expect(updateDiffRepository.deleteByProjectAndChain).toHaveBeenCalledWith(
        PROJECT_A,
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

      await updateDiffer.runForProject(PROJECT_A, UnixTime.now())

      expect(updateDiffRepository.deleteByProjectAndChain).toHaveBeenCalledWith(
        PROJECT_A,
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

      await updateDiffer.runForProject(PROJECT_A, UnixTime.now())

      expect(dbTransaction).not.toHaveBeenCalled()
      expect(getUpdateDiffsMock).not.toHaveBeenCalled()
      expect(
        updateDiffRepository.deleteByProjectAndChain,
      ).not.toHaveBeenCalled()
      expect(updateDiffRepository.insertMany).not.toHaveBeenCalled()
    })

    // A consumer only holds an immutable Reference stub, so without folding the
    // referenced project in, an upgrade there produces no diff for the consumer.
    it('reports a change inside a referenced project as its own', async () => {
      const changed = {
        ...mockContract(NAME_A, ADDRESS_A),
        values: { $implementation: ADDRESS_C },
      }
      const updateDiffer = referencingUpdateDiffer({
        onDisk: {
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
          [PROVIDER]: discoveryOf(PROVIDER, [mockContract(NAME_A, ADDRESS_A)]),
        },
        latest: {
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
          [PROVIDER]: discoveryOf(PROVIDER, [changed]),
        },
      })

      await updateDiffer.runForProject(PROJECT_A, UnixTime.now())

      const inserted = updateDiffer.inserted
      expect(inserted.length).toEqual(1)
      expect(inserted[0]?.projectId).toEqual(PROJECT_A)
      expect(inserted[0]?.type).toEqual('implementationChange')
      expect(inserted[0]?.address).toEqual(ADDRESS_A)
    })

    // The referenced project may not have been discovered yet in this shuffled
    // run, which must stay silent rather than look like a mass deletion.
    it('reports nothing when a referenced project has not run yet', async () => {
      const updateDiffer = referencingUpdateDiffer({
        onDisk: {
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
          [PROVIDER]: discoveryOf(PROVIDER, [mockContract(NAME_A, ADDRESS_A)]),
        },
        latest: {
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
        },
      })

      await updateDiffer.runForProject(PROJECT_A, UnixTime.now())

      expect(updateDiffer.inserted).toEqual([])
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
        address: ChainSpecificAddress.random(),
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
        timestamp,
        123,
        456,
      )

      expect(result).toEqual([
        {
          address: diff.address,
          type: 'implementationChange',
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
        address: ChainSpecificAddress.random(),
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
        timestamp,
        123,
        456,
      )

      expect(result).toEqual([
        {
          address: diff.address,
          type: 'highSeverityFieldChange',
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
      const address = ChainSpecificAddress.random()
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
        latestDiscovery.entries,
        PROJECT_A,
        timestamp,
        123,
        456,
      )

      expect(result).toEqual([
        {
          address,
          type: 'ultimateUpgraderChange',
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

      updateDiffer.getOnDiskDiscovery(PROJECT_A)

      expect(configReader.readDiscovery).toHaveBeenCalledWith(PROJECT_A)
    })
  })
})

function referencingUpdateDiffer(discoveries: {
  onDisk: Record<string, DiscoveryOutput>
  latest: Record<string, DiscoveryOutput>
}) {
  const inserted: UpdateDiffRecord[] = []
  const updateDiffer = new UpdateDiffer(
    mockObject<ConfigReader>({
      readDiscovery: (name: string) => {
        const found = discoveries.onDisk[name]
        if (found === undefined) throw new Error(`Unknown project ${name}`)
        return found
      },
    }),
    mockObject<Database>({
      transaction: async (fun) => await fun(),
      updateDiff: mockObject<UpdateDiffRepository>({
        insertMany: async (records) => {
          inserted.push(...records)
          return records.length
        },
        deleteByProjectAndChain: async () => {},
      }),
    }),
    mockObject<DiscoveryOutputCache>({
      get: (name: string) => discoveries.latest[name],
    }),
    Logger.SILENT,
  )
  return Object.assign(updateDiffer, { inserted })
}

function discoveryOf(
  name: string,
  entries: EntryParameters[],
): DiscoveryOutput {
  return { ...mockProject, name, entries }
}

function reference(
  targetProject: string,
  address: ChainSpecificAddress,
): EntryParameters {
  return { type: 'Reference', address, targetProject }
}

const PROVIDER = 'shared-provider'
const PROJECT_A = 'project-a'
const NAME_A = 'contract-a'
const ADDRESS_A = ChainSpecificAddress.random()
const NAME_B = 'contract-b'
const ADDRESS_B = ChainSpecificAddress.random()
const ADDRESS_C = ChainSpecificAddress.random()

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
  timestamp: 1,
  configHash: Hash256.random(),
  entries: COMMITTED,
  abis: {},
  usedTemplates: {},
  usedBlockNumbers: {},
}

function mockContract(
  name: string,
  address: ChainSpecificAddress,
): EntryParameters {
  return {
    type: 'Contract',
    name,
    address,
    values: { $immutable: true },
  }
}
