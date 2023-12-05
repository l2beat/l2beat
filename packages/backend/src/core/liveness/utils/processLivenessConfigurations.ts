import { assert } from '@l2beat/backend-tools'

import { Project } from '../../../model'
import {
  LivenessConfigurationRecord,
  NewLivenessConfigurationRecord,
} from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessId } from '../types/LivenessId'

export function processLivenessConfigurations(
  projects: Project[],
  configurations: LivenessConfigurationRecord[],
): {
  added: NewLivenessConfigurationRecord[]
  updated: LivenessConfigurationRecord[]
  phasedOut: LivenessConfigurationRecord[]
} {
  const usedIdentifiers = new Set<string>()
  const added: NewLivenessConfigurationRecord[] = []
  const updated: LivenessConfigurationRecord[] = []

  // there cannot be two same hashes in one project, write a test for it, this can be solved via including sinceTimestamp probably

  for (const project of projects) {
    const { livenessConfig } = project

    if (livenessConfig) {
      const processConfigType = (configType: 'functionCalls' | 'transfers') => {
        for (const runtimeConfig of livenessConfig[configType]) {
          const identifier = LivenessId(runtimeConfig)
          assert(
            !usedIdentifiers.has(identifier.toString()),
            'There cannot be duplicate identifiers',
          )
          usedIdentifiers.add(identifier.toString())

          const dbConfig = configurations.find(
            (c) => c.identifier === identifier,
          )
          if (dbConfig === undefined) {
            added.push({
              projectId: runtimeConfig.projectId,
              type: runtimeConfig.type,
              identifier,
              params: JSON.stringify(LivenessId.params(runtimeConfig)),
              sinceTimestamp: runtimeConfig.sinceTimestamp,
              untilTimestamp: runtimeConfig.untilTimestamp,
            })
          } else {
            if (LivenessId.wasUpdated(dbConfig, runtimeConfig)) {
              updated.push({
                ...dbConfig,
                untilTimestamp: runtimeConfig.untilTimestamp,
              })
            }
          }
        }
      }

      processConfigType('functionCalls')
      processConfigType('transfers')
    }
  }

  const phasedOut = configurations.filter(
    (c) => !usedIdentifiers.has(c.identifier.toString()),
  )

  return {
    added,
    updated,
    phasedOut,
  }
}
