import { assert } from '@l2beat/backend-tools'

import { Project } from '../../../model'
import {
  LivenessConfigurationRecord,
  NewLivenessConfigurationRecord,
} from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessConfigurationIdentifier } from '../types/LivenessConfigurationIdentifier'

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
        for (const config of livenessConfig[configType]) {
          const identifier = LivenessConfigurationIdentifier(config)
          assert(
            !usedIdentifiers.has(identifier.toString()),
            'There cannot be duplicate identifiers',
          )
          usedIdentifiers.add(identifier.toString())

          const savedConfig = configurations.find(
            (c) => c.identifier === identifier,
          )
          if (savedConfig === undefined) {
            added.push({
              projectId: config.projectId,
              type: config.type,
              identifier,
              params: JSON.stringify(
                LivenessConfigurationIdentifier.params(config),
              ),
              sinceTimestamp: config.sinceTimestamp,
              untilTimestamp: config.untilTimestamp,
            })
          } else {
            if (
              LivenessConfigurationIdentifier.wasUpdated(savedConfig, config)
            ) {
              updated.push({
                ...savedConfig,
                untilTimestamp: config.untilTimestamp,
                lastSyncedTimestamp: config.untilTimestamp,
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
