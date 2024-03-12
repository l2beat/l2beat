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
      const changedUntilTimestamp = UnixTime.now()

      const updated = {
        ...CONFIGURATIONS[1],
        untilTimestamp: changedUntilTimestamp,
      }

      const result = diffTrackedTxConfigurations(
        [...CONFIGURATIONS.slice(0, 1), updated],
        DB_CONFIGURATIONS,
      )
      configurationsToRecords([updated])

      expect(result.toTrim).toEqualUnsorted(
        configurationsToRecords([updated]).map((r) => ({
          id: r.id,
          untilTimestamp: changedUntilTimestamp,
        })),
      )
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
    sinceTimestamp: FROM,
    untilTimestamp: FROM.add(2, 'days'),
    uses: [
      {
        type: 'liveness',
        subType: 'batchSubmissions',
        id: TrackedTxId.random(),
      },
    ],
  },
  {
    projectId: ProjectId('project1'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x9aaab648',
    sinceTimestamp: FROM,
    uses: [
      { type: 'liveness', subType: 'stateUpdates', id: TrackedTxId.random() },
      {
        type: 'liveness',
        subType: 'proofSubmissions',
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
