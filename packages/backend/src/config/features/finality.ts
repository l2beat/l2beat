import type { Env } from '@l2beat/backend-tools'
import type { Project, ProjectService } from '@l2beat/config'
import type { FinalityConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getFinalityConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
): Promise<FinalityConfig> {
  const projects = await ps.getProjects({
    select: ['finalityConfig'],
    optional: ['transactionApiConfig'],
    whereNot: ['isArchived'],
  })

  return {
    configurations: projects
      .filter((p) => flags.isEnabled('finality', p.id))
      .map((p) => ({
        projectId: p.id,
        ...p.finalityConfig,
        ...getChainFinalityConfig(env, p),
      })),
  }
}

function getChainFinalityConfig(
  env: Env,
  project: Project<never, 'transactionApiConfig'>,
) {
  if (
    project.transactionApiConfig?.type === 'loopring' ||
    project.transactionApiConfig?.type === 'degate3'
  ) {
    return {
      url: project.transactionApiConfig.defaultUrl,
      callsPerMinute: project.transactionApiConfig.defaultCallsPerMinute,
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
