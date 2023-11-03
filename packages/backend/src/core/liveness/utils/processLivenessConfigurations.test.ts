import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { Project } from '../../../model'
import {
  LivenessConfigurationRecord,
  NewLivenessConfigurationRecord,
} from '../../../peripherals/database/LivenessConfigurationRepository'
import { LIVENESS_MOCK } from '../../../test/mockLiveness'
import { processLivenessConfigurations } from './processLivenessConfigurations'

const { PROJECTS, CONFIGURATIONS } = LIVENESS_MOCK

describe(processLivenessConfigurations.name, () => {
  describe('added', () => {
    it('finds configs not saved in the DB', () => {
      const result = processLivenessConfigurations(
        PROJECTS,
        CONFIGURATIONS.slice(0, 1),
      )

      const added: NewLivenessConfigurationRecord[] = CONFIGURATIONS.slice(
        1,
      ).map((c) => ({
        identifier: c.identifier,
        type: c.type,
        params: c.params,
        sinceTimestamp: c.sinceTimestamp,
        untilTimestamp: c.untilTimestamp,
        projectId: c.projectId,
      }))

      expect(result.added).toEqualUnsorted(added)
    })

    it('no configs to add', () => {
      const result = processLivenessConfigurations(PROJECTS, CONFIGURATIONS)

      expect(result.added).toEqual([])
    })
  })

  describe('updated', () => {
    it('finds configs which untilTimestamp have changed', () => {
      const changedUntilTimestamp = UnixTime.now()

      const result = processLivenessConfigurations(
        [
          {
            ...PROJECTS[0],
            livenessConfig: {
              transfers: PROJECTS[0].livenessConfig!.transfers,
              functionCalls: [
                {
                  ...PROJECTS[0].livenessConfig!.functionCalls[0],
                  untilTimestamp: changedUntilTimestamp,
                },
              ],
            },
          },
        ],
        CONFIGURATIONS,
      )

      const updated: LivenessConfigurationRecord[] = CONFIGURATIONS.slice(
        1,
      ).map((c) => ({
        id: c.id,
        identifier: c.identifier,
        type: c.type,
        params: c.params,
        sinceTimestamp: c.sinceTimestamp,
        untilTimestamp: changedUntilTimestamp,
        projectId: c.projectId,
        lastSyncedTimestamp: undefined,
      }))

      expect(result.updated).toEqualUnsorted(updated)
    })

    it('no configs to update', () => {
      const result = processLivenessConfigurations(PROJECTS, CONFIGURATIONS)

      expect(result.added).toEqual([])
    })
  })

  describe('phased out', () => {
    it("finds configs present in the DB but not included in any project's config", () => {
      const project: Project = {
        projectId: PROJECTS[0].projectId,
        type: PROJECTS[0].type,
        escrows: PROJECTS[0].escrows,
        livenessConfig: {
          transfers: [],
          functionCalls: PROJECTS[0].livenessConfig!.functionCalls,
        },
      }

      const result = processLivenessConfigurations([project], CONFIGURATIONS)

      expect(result.phasedOut).toEqualUnsorted(CONFIGURATIONS.slice(0, 1))
    })

    it('no configs to phase out', () => {
      const result = processLivenessConfigurations(PROJECTS, CONFIGURATIONS)

      expect(result.phasedOut).toEqual([])
    })
  })

  it('throws when duplicate identifiers detected', () => {
    const project: Project = {
      projectId: PROJECTS[0].projectId,
      type: PROJECTS[0].type,
      escrows: PROJECTS[0].escrows,
      livenessConfig: {
        transfers: [],
        functionCalls: [
          PROJECTS[0].livenessConfig!.functionCalls[0],
          PROJECTS[0].livenessConfig!.functionCalls[0],
        ],
      },
    }

    expect(() =>
      processLivenessConfigurations([project], CONFIGURATIONS),
    ).toThrow()
  })
})
