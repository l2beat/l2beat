import { assert } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import { Project } from '../../../model'
import { LivenessConfigurationRecord } from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessFunctionCall, LivenessTransfer } from '../types/LivenessConfig'
import { LivenessConfigurationIdentifier } from '../types/LivenessConfigurationIdentifier'

export function mergeConfigs(
  projects: Project[],
  configs: LivenessConfigurationRecord[],
): {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
} {
  return {
    transfers: projects
      .flatMap((p) => p.livenessConfig?.transfers)
      .filter(notUndefined)
      .map((t) => {
        const config = configs.find(
          (c) => c.identifier === LivenessConfigurationIdentifier(t),
        )

        assert(config, 'Config should not be undefined there')

        return {
          ...t,
          latestSyncedTimestamp: config.lastSyncedTimestamp,
          livenessConfigurationId: config.id,
        }
      }),
    functionCalls: projects
      .flatMap((p) => p.livenessConfig?.functionCalls)
      .filter(notUndefined)
      .map((t) => {
        const config = configs.find(
          (c) => c.identifier === LivenessConfigurationIdentifier(t),
        )
        assert(config, 'Config should not be undefined there')

        return {
          ...t,
          latestSyncedTimestamp: config.lastSyncedTimestamp,
          livenessConfigurationId: config.id,
        }
      }),
  }
}
