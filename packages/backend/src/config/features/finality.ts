import type { Env } from '@l2beat/backend-tools'
import { type Layer2, type Layer2FinalityConfig, layer2s } from '@l2beat/config'
import { type ProjectId, notUndefined } from '@l2beat/shared-pure'

import type { FeatureFlags } from '../FeatureFlags'

export type FinalityProjectConfig = Layer2FinalityConfig & {
  projectId: ProjectId
  url?: string
  callsPerMinute?: number
}

export function getFinalityConfigurations(
  flags: FeatureFlags,
  env: Env,
): FinalityProjectConfig[] {
  return layer2s
    .map((layer2) => {
      if (
        !layer2.config.finality ||
        !flags.isEnabled('finality', layer2.id.toString()) ||
        layer2.isArchived
      ) {
        return
      }

      return {
        projectId: layer2.id,
        ...layer2.config.finality,
        ...getChainFinalityConfig(env, layer2),
      }
    })
    .filter(notUndefined)
}

function getChainFinalityConfig(env: Env, project: Layer2) {
  if (
    project.config.transactionApi?.type === 'loopring' ||
    project.config.transactionApi?.type === 'degate3'
  ) {
    return {
      url: project.config.transactionApi.defaultUrl,
      callsPerMinute: project.config.transactionApi.defaultCallsPerMinute,
    }
  }

  const ENV_NAME = project.id.toUpperCase().replace(/-/g, '_')

  return {
    url: env.optionalString([
      `${ENV_NAME}_RPC_URL_FOR_FINALITY`,
      `${ENV_NAME}_RPC_URL`,
    ]),
    callsPerMinute: env.optionalInteger([
      `${ENV_NAME}_RPC_CALLS_PER_MINUTE_FOR_FINALITY`,
      `${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
    ]),
  }
}
