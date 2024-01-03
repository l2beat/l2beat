import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  LivenessConfigEntry,
  makeLivenessFunctionCall,
  makeLivenessTransfer,
} from '../types/LivenessConfig'
import { diffLivenessConfigurations } from './diffLivenessConfigurations'

describe(diffLivenessConfigurations.name, () => {
  describe('added', () => {
    it('finds configs not saved in the DB', () => {
      const result = diffLivenessConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS.slice(0, 1),
      )

      const added: LivenessConfigEntry[] = CONFIGURATIONS.slice(1)

      expect(result.toAdd).toEqualUnsorted(added)
    })

    it('no configs to add', () => {
      const result = diffLivenessConfigurations(
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

      const result = diffLivenessConfigurations(
        [...CONFIGURATIONS.slice(0, 1), updated],
        DB_CONFIGURATIONS,
      )

      expect(result.toTrim).toEqualUnsorted([
        { id: updated.id, untilTimestamp: changedUntilTimestamp },
      ])
    })

    it('no configs to update', () => {
      const result = diffLivenessConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS,
      )

      expect(result.toAdd).toEqual([])
    })
  })

  describe('phased out', () => {
    it("finds configs present in the DB but not included in any project's config", () => {
      const result = diffLivenessConfigurations(
        CONFIGURATIONS.slice(1),
        DB_CONFIGURATIONS,
      )

      expect(result.toRemove).toEqualUnsorted(
        CONFIGURATIONS.slice(0, 1).map((c) => c.id),
      )
    })

    it('no configs to phase out', () => {
      const result = diffLivenessConfigurations(
        CONFIGURATIONS,
        DB_CONFIGURATIONS,
      )

      expect(result.toRemove).toEqual([])
    })
  })
})

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

const CONFIGURATIONS: LivenessConfigEntry[] = [
  makeLivenessTransfer({
    projectId: ProjectId('project1'),
    formula: 'transfer',
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
    type: 'DA',
    sinceTimestamp: FROM,
    untilTimestamp: FROM.add(2, 'days'),
  }),
  makeLivenessFunctionCall({
    projectId: ProjectId('project1'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x9aaab648',
    sinceTimestamp: FROM,
    type: 'STATE',
  }),
]

const DB_CONFIGURATIONS = CONFIGURATIONS.map((c) => ({
  ...c,
  lastSyncedTimestamp: undefined,
  debugInfo: '',
}))
