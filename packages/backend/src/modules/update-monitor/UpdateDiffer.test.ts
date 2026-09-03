import { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
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
  describe(UpdateDiffer.prototype.run.name, () => {
    it('replaces the rows of every project it diffs', async () => {
      const differ = differOver({
        onDisk: { [PROJECT_A]: discoveryOf(PROJECT_A, [contract(ADDRESS_A)]) },
        latest: { [PROJECT_A]: discoveryOf(PROJECT_A, [upgraded(ADDRESS_A)]) },
      })

      await differ.run([PROJECT_A], UnixTime.now())

      expect(differ.deleted).toEqual([PROJECT_A])
      expect(differ.inserted).toEqual([
        record(PROJECT_A, ADDRESS_A, 'implementationChange'),
      ])
    })

    it('clears the rows of a project without changes', async () => {
      const differ = differOver({
        onDisk: { [PROJECT_A]: discoveryOf(PROJECT_A, [contract(ADDRESS_A)]) },
        latest: { [PROJECT_A]: discoveryOf(PROJECT_A, [contract(ADDRESS_A)]) },
      })

      await differ.run([PROJECT_A], UnixTime.now())

      expect(differ.deleted).toEqual([PROJECT_A])
      expect(differ.inserted).toEqual([])
    })

    it('keeps the rows of a project whose on disk discovery is newer', async () => {
      const differ = differOver({
        onDisk: {
          [PROJECT_A]: {
            ...discoveryOf(PROJECT_A, [contract(ADDRESS_A)]),
            timestamp: 2,
          },
        },
        latest: {
          [PROJECT_A]: {
            ...discoveryOf(PROJECT_A, [upgraded(ADDRESS_A)]),
            timestamp: 1,
          },
        },
      })

      await differ.run([PROJECT_A], UnixTime.now())

      expect(differ.inserted).toEqual([])
      expect(differ.deleted).toEqual([])
    })

    it('keeps the rows of a project that was not discovered', async () => {
      const differ = differOver({
        onDisk: { [PROJECT_A]: discoveryOf(PROJECT_A, [contract(ADDRESS_A)]) },
        latest: {},
      })

      await differ.run([PROJECT_A], UnixTime.now())

      expect(differ.inserted).toEqual([])
      expect(differ.deleted).toEqual([])
    })

    it('attributes a change to every project referencing the address', async () => {
      const differ = differOver({
        onDisk: {
          [PROVIDER]: discoveryOf(PROVIDER, [contract(ADDRESS_A)]),
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
          [PROJECT_B]: discoveryOf(PROJECT_B, [reference(PROVIDER, ADDRESS_A)]),
        },
        latest: {
          [PROVIDER]: discoveryOf(PROVIDER, [upgraded(ADDRESS_A)]),
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
          [PROJECT_B]: discoveryOf(PROJECT_B, [reference(PROVIDER, ADDRESS_A)]),
        },
      })

      await differ.run([PROVIDER, PROJECT_A, PROJECT_B], UnixTime.now())

      expect(differ.inserted).toEqual([
        record(PROVIDER, ADDRESS_A, 'implementationChange'),
        record(PROJECT_A, ADDRESS_A, 'implementationChange'),
        record(PROJECT_B, ADDRESS_A, 'implementationChange'),
      ])
    })

    // forknet references 4 of shared-polygon-cdk's 34 entries, so the other 30
    // must not be able to raise an update for it.
    it('does not attribute a change at an address it does not reference', async () => {
      const differ = differOver({
        onDisk: {
          [PROVIDER]: discoveryOf(PROVIDER, [
            contract(ADDRESS_A),
            contract(ADDRESS_B),
          ]),
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
        },
        latest: {
          [PROVIDER]: discoveryOf(PROVIDER, [
            contract(ADDRESS_A),
            upgraded(ADDRESS_B),
          ]),
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
        },
      })

      await differ.run([PROVIDER, PROJECT_A], UnixTime.now())

      expect(differ.inserted).toEqual([
        record(PROVIDER, ADDRESS_B, 'implementationChange'),
      ])
    })

    it('attributes a change along a chain of references', async () => {
      const differ = differOver({
        onDisk: {
          [SECOND_PROVIDER]: discoveryOf(SECOND_PROVIDER, [
            contract(ADDRESS_A),
          ]),
          [PROVIDER]: discoveryOf(PROVIDER, [
            reference(SECOND_PROVIDER, ADDRESS_A),
          ]),
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
        },
        latest: {
          [SECOND_PROVIDER]: discoveryOf(SECOND_PROVIDER, [
            upgraded(ADDRESS_A),
          ]),
          [PROVIDER]: discoveryOf(PROVIDER, [
            reference(SECOND_PROVIDER, ADDRESS_A),
          ]),
          [PROJECT_A]: discoveryOf(PROJECT_A, [reference(PROVIDER, ADDRESS_A)]),
        },
      })

      await differ.run([SECOND_PROVIDER, PROVIDER, PROJECT_A], UnixTime.now())

      expect(differ.inserted.map((r) => r.projectId)).toEqual([
        SECOND_PROVIDER,
        PROVIDER,
        PROJECT_A,
      ])
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

    // A holder receiving its first permission produces a whole-field diff with
    // no index, which is the shape an address owned by a referenced project
    // takes the first time a project's permission chain reaches it.
    it('detects an upgrade change on a first permission', () => {
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
        addressType: 'Reference',
        diff: [{ key: 'receivedPermissions' }],
      }

      const latestDiscovery = mockObject<DiscoveryOutput>({
        entries: [
          mockObject<EntryParameters>({
            address,
            receivedPermissions: [
              mockObject<ReceivedPermission>({ permission: 'upgrade' }),
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

      expect(result.map((r) => r.type)).toEqual(['ultimateUpgraderChange'])
    })

    // The holder lost its last permission, so the latest entry names nothing
    // and only the removed value still says an upgrader went away.
    it('detects an upgrade change when the last permission is removed', () => {
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
        addressType: 'Reference',
        diff: [
          {
            key: 'receivedPermissions',
            before: JSON.stringify([{ permission: 'upgrade', from: address }]),
          },
        ],
      }

      const latestDiscovery = mockObject<DiscoveryOutput>({
        entries: [
          mockObject<EntryParameters>({
            address,
            receivedPermissions: undefined,
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

      expect(result.map((r) => r.type)).toEqual(['ultimateUpgraderChange'])
    })

    it('ignores a removed permission that was not an upgrade', () => {
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
        addressType: 'Reference',
        diff: [
          {
            key: 'receivedPermissions',
            before: JSON.stringify([{ permission: 'interact', from: address }]),
          },
        ],
      }

      const latestDiscovery = mockObject<DiscoveryOutput>({
        entries: [
          mockObject<EntryParameters>({
            address,
            receivedPermissions: undefined,
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

      expect(result.map((r) => r.type)).toEqual([])
    })

    // The upgrade was replaced in place, so the latest entry names the
    // replacement and only the previous value says an upgrader went away.
    it('detects an upgrade change when a permission is replaced', () => {
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
            key: 'receivedPermissions.0.permission',
            before: JSON.stringify('upgrade'),
            after: JSON.stringify('interact'),
          },
        ],
      }

      const latestDiscovery = mockObject<DiscoveryOutput>({
        entries: [
          mockObject<EntryParameters>({
            address,
            receivedPermissions: [
              mockObject<ReceivedPermission>({ permission: 'interact' }),
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

      expect(result.map((r) => r.type)).toEqual(['ultimateUpgraderChange'])
    })

    it('ignores a replacement that never involved an upgrade', () => {
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
            key: 'receivedPermissions.0.permission',
            before: JSON.stringify('interact'),
            after: JSON.stringify('act'),
          },
        ],
      }

      const latestDiscovery = mockObject<DiscoveryOutput>({
        entries: [
          mockObject<EntryParameters>({
            address,
            receivedPermissions: [
              mockObject<ReceivedPermission>({ permission: 'act' }),
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

      expect(result.map((r) => r.type)).toEqual([])
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

function differOver(discoveries: {
  onDisk: Record<string, DiscoveryOutput>
  latest: Record<string, DiscoveryOutput>
}) {
  const inserted: UpdateDiffRecord[] = []
  const deleted: string[] = []
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
      updateDiff: mockObject<Database['updateDiff']>({
        insertMany: async (records) => {
          inserted.push(...records)
          return records.length
        },
        deleteByProjectAndChain: async (projectId) => {
          deleted.push(projectId)
        },
      }),
    }),
    mockObject<DiscoveryOutputCache>({
      get: (name: string) => discoveries.latest[name],
    }),
    Logger.SILENT,
  )
  return Object.assign(updateDiffer, { inserted, deleted })
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

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address, values: { $implementation: ADDRESS_C } }
}

function upgraded(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address, values: { $implementation: ADDRESS_A } }
}

function record(
  projectId: string,
  address: ChainSpecificAddress,
  type: UpdateDiffRecord['type'],
): UpdateDiffRecord {
  return {
    projectId,
    address,
    type,
    timestamp: expect.a(Number) as unknown as UnixTime,
    diffBaseTimestamp: expect.a(Number) as unknown as number,
    diffHeadTimestamp: expect.a(Number) as unknown as number,
  }
}

const PROVIDER = 'shared-provider'
const SECOND_PROVIDER = 'shared-second-provider'
const PROJECT_A = 'project-a'
const PROJECT_B = 'project-b'
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
