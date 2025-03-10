import { Env } from '@l2beat/backend-tools'
import type { ChainConfig, ProjectService } from '@l2beat/config'
import type { ActivityConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getActivityConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
): Promise<ActivityConfig> {
  const projects = await ps.getProjects({
    select: ['activityConfig', 'chainConfig'],
    whereNot: ['isArchived'],
  })

  return {
    projects: projects
      .filter((p) => flags.isEnabled('activity', p.id))
      .map((p) => ({
        id: p.id,
        chainName: p.chainConfig.name,
        activityConfig: p.activityConfig,
        // TODO: This really shouldn't be here and the logic is weird.
        batchSize: getBatchSizeFromCallsPerMinute(
          getCallsPerMinute(env, p.chainConfig),
        ),
      })),
  }
}

function getCallsPerMinute(env: Env, config?: ChainConfig) {
  if (!config) {
    return 60
  }

  const value = env.optionalInteger(
    Env.key(config.name, 'RPC_CALLS_PER_MINUTE'),
  )
  if (value) {
    return value
  }

  for (const api of config?.apis ?? []) {
    if ('callsPerMinute' in api) {
      if (api.callsPerMinute) {
        return api.callsPerMinute
      }
    }
  }

  return 60
}

function getBatchSizeFromCallsPerMinute(callsPerMinute: number): number {
  return Math.max(1, Math.floor(callsPerMinute / 60))
}
