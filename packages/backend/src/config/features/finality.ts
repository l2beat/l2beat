import { Env } from '@l2beat/backend-tools'
import { Layer2, Layer2FinalityConfig, layer2s } from '@l2beat/config'
import { notUndefined, ProjectId } from '@l2beat/shared-pure'

import { FeatureFlags } from '../FeatureFlags'

export type FinalityIndexerConfig = Layer2FinalityConfig & {
  projectId: ProjectId
  url?: string
  callsPerMinute?: number
}

export function getFinalityIndexerConfigurations(
  flags: FeatureFlags,
  env: Env,
): FinalityIndexerConfig[] {
  return layer2s
    .map((layer2) => {
      if (
        !layer2.config.finality ||
        !flags.isEnabled('finality', layer2.id.toString()) ||
        layer2.config.finality.type === 'OPStack'
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
  const ENV_NAME = project.id.toUpperCase().replace(/-/g, '_')

  return {
    url: env.optionalString(`FINALITY_${ENV_NAME}_PROVIDER_URL`),
    callsPerMinute: env.optionalInteger(
      `FINALITY_${ENV_NAME}_PROVIDER_CALLS_PER_MINUTE`,
    ),
  }
}
