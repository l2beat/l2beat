import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { trackedTxConfigEntryToRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
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
      const configurations = [
        {
          ...CONFIGURATIONS[0],
          untilTimestampExclusive: UnixTime.now().add(-5, 'days'),
        },
        {
          ...CONFIGURATIONS[1],
          untilTimestampExclusive: UnixTime.now(),
        },
      ]

      const dbConfigs = [
        {
          ...DB_CONFIGURATIONS[0],
          lastSyncedTimestamp: UnixTime.now().add(-10, 'days'),
        },
        ...DB_CONFIGURATIONS.slice(1, 3),
      ]

      const result = diffTrackedTxConfigurations(configurations, dbConfigs)

      expect(result.toChangeUntilTimestamp).toEqualUnsorted([
        {
          id: configurations[0].uses[0].id,
          untilTimestampExclusive: configurations[0].untilTimestampExclusive,
          lastSyncedTimestamp: dbConfigs[0].lastSyncedTimestamp,
        },
        {
          id: configurations[1].uses[0].id,
          untilTimestampExclusive: configurations[1].untilTimestampExclusive,
          lastSyncedTimestamp: dbConfigs[1].lastSyncedTimestamp,
        },
        {
          id: configurations[1].uses[1].id,
          untilTimestampExclusive: configurations[1].untilTimestampExclusive,
          lastSyncedTimestamp: dbConfigs[2].lastSyncedTimestamp,
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
