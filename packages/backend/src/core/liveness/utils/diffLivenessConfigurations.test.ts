import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LIVENESS_MOCK } from '../../../test/mockLiveness'
import { LivenessConfigEntry } from '../types/LivenessConfig'
import { diffLivenessConfigurations } from './diffLivenessConfigurations'

const { CONFIGURATIONS, DB_CONFIGURATIONS } = LIVENESS_MOCK

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
