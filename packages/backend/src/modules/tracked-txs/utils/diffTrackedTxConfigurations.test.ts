import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import {
  trackedTxConfigEntryToRecord,
  TrackedTxsConfigRecord,
} from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import {
  TrackedTxConfigEntry,
  TrackedTxUseWithId,
} from '../types/TrackedTxsConfig'
import { diffTrackedTxConfigurations } from './diffTrackedTxConfigurations'

describe(diffTrackedTxConfigurations.name, () => {
  describe('added', () => {
    it('finds configs not saved in the DB', () => {
      const result = diffTrackedTxConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS.slice(0, 1),
      )

      const added: TrackedTxConfigEntry[] = CONFIGURATIONS.slice(1)

      expect(result.toAdd).toEqualUnsorted(configurationsToRecords(added))
    })

    it('no configs to add', () => {
      const result = diffTrackedTxConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS,
      )

      expect(result.toAdd).toEqual([])
    })
  })

  describe('updated', () => {
    it('finds configs which untilTimestamp have changed', () => {
      const now = UnixTime.now()
      const configs: [TrackedTxsConfigRecord, TrackedTxConfigEntry][] = [
        // added untilTimestamp
        [
          mockTrackedTxsConfigRecord({
            untilTimestampExclusive: undefined,
            lastSyncedTimestamp: now,
            id: TrackedTxId(['1']),
          }),
          mockTrackedTxConfigEntry(
            {
              untilTimestampExclusive: now.add(-5, 'days'),
            },
            [{ id: TrackedTxId(['1']) }],
          ),
        ],
        // removed untilTimestamp
        [
          mockTrackedTxsConfigRecord({
            untilTimestampExclusive: now.add(-5, 'days'),
            lastSyncedTimestamp: now.add(-5, 'days'),
            id: TrackedTxId(['2']),
          }),
          mockTrackedTxConfigEntry({ untilTimestampExclusive: undefined }, [
            { id: TrackedTxId(['2']) },
          ]),
        ],
        // changed to bigger untilTimestamp
        [
          mockTrackedTxsConfigRecord({
            untilTimestampExclusive: now.add(-5, 'days'),
            lastSyncedTimestamp: now.add(-5, 'days'),
            id: TrackedTxId(['3']),
          }),
          mockTrackedTxConfigEntry(
            {
              untilTimestampExclusive: now.add(-3, 'days'),
            },
            [{ id: TrackedTxId(['3']) }],
          ),
        ],
        // changed to smaller untilTimestamp
        [
          mockTrackedTxsConfigRecord({
            untilTimestampExclusive: now.add(-3, 'days'),
            lastSyncedTimestamp: now.add(-3, 'days'),
            id: TrackedTxId(['4']),
          }),
          mockTrackedTxConfigEntry(
            {
              untilTimestampExclusive: now.add(-5, 'days'),
            },
            [{ id: TrackedTxId(['4']) }],
          ),
        ],
        // not changed untilTimestamp
        [
          mockTrackedTxsConfigRecord({
            untilTimestampExclusive: now.add(-3, 'days'),
            lastSyncedTimestamp: now.add(-3, 'days'),
            id: TrackedTxId(['5']),
          }),
          mockTrackedTxConfigEntry(
            {
              untilTimestampExclusive: now.add(-3, 'days'),
            },
            [{ id: TrackedTxId(['5']) }],
          ),
        ],
      ]
      const databaseConfigurations = configs.map((c) => c[0])
      const runtimeConfigurations = configs.map((c) => c[1])

      const result = diffTrackedTxConfigurations(
        runtimeConfigurations,
        databaseConfigurations,
      )

      expect(result.toAdd).toEqual([])
      expect(result.toRemove).toEqual([])
      expect(result.toChangeUntilTimestamp).toEqual([
        {
          id: TrackedTxId(['1']),
          untilTimestampExclusive: now.add(-5, 'days'),
          trim: true,
        },
        {
          id: TrackedTxId(['2']),
          untilTimestampExclusive: undefined,
          trim: true,
        },
        {
          id: TrackedTxId(['3']),
          untilTimestampExclusive: now.add(-3, 'days'),
          trim: false,
        },
        {
          id: TrackedTxId(['4']),
          untilTimestampExclusive: now.add(-5, 'days'),
          trim: true,
        },
      ])
    })

    it('no configs to update', () => {
      const result = diffTrackedTxConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS,
      )

      expect(result.toAdd).toEqual([])
    })
  })

  describe('phased out', () => {
    it("finds configs present in the DB but not included in any project's config", () => {
      const result = diffTrackedTxConfigurations(
        CONFIGURATIONS.slice(1),
        DB_CONFIGURATIONS,
      )

      expect(result.toRemove).toEqualUnsorted(
        configurationsToRecords(CONFIGURATIONS.slice(0, 1)).map((r) => r.id),
      )
    })

    it('no configs to phase out', () => {
      const result = diffTrackedTxConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS,
      )

      expect(result.toRemove).toEqual([])
    })
  })
})

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

function mockTrackedTxConfigEntry(
  entry: Partial<TrackedTxConfigEntry>,
  uses?: Partial<TrackedTxUseWithId>[],
) {
  return mockObject<TrackedTxConfigEntry>({
    ...entry,
    uses: uses?.map((u) => mockObject<TrackedTxUseWithId>(u)),
  })
}

function mockTrackedTxsConfigRecord(record: Partial<TrackedTxsConfigRecord>) {
  return mockObject<TrackedTxsConfigRecord>(record)
}

const CONFIGURATIONS: TrackedTxConfigEntry[] = [
  {
    projectId: ProjectId('project1'),
    formula: 'transfer',
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
    sinceTimestampInclusive: FROM,
    untilTimestampExclusive: FROM.add(2, 'days'),
    uses: [
      {
        type: 'liveness',
        subtype: 'batchSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  },
  {
    projectId: ProjectId('project1'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x9aaab648',
    sinceTimestampInclusive: FROM,
    uses: [
      { type: 'liveness', subtype: 'stateUpdates', id: TrackedTxId.random() },
      {
        type: 'liveness',
        subtype: 'proofSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  },
]

const DB_CONFIGURATIONS = CONFIGURATIONS.flatMap((c) =>
  c.uses.map((u) => ({
    ...c,
    ...u,
    lastSyncedTimestamp: undefined,
    debugInfo: '',
  })),
)

const configurationsToRecords = (configs: TrackedTxConfigEntry[]) =>
  configs.flatMap((c) => c.uses.map((u) => trackedTxConfigEntryToRecord(c, u)))
