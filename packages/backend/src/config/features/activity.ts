import { Env } from '@l2beat/backend-tools'
import type { Project, ProjectService } from '@l2beat/config'
import type { ActivityTransactionConfig } from '../../modules/activity/ActivityTransactionConfig'
import type { ActivityConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60
const DEFAULT_RESYNC_LAST_DAYS = 7

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
      .filter((x) => flags.isEnabled('activity', x.id.toString()))
      .map((x) => ({
        id: x.id,
        config: getActivityTransactionConfig(env, x),
      })),
  }
}

function getActivityTransactionConfig(
  env: Env,
  project: Project<'activityConfig' | 'chainConfig'>,
): ActivityTransactionConfig {
  if (project.activityConfig.type === 'block') {
    for (const api of project.chainConfig.apis) {
      if (api.type === 'rpc') {
        return {
          type: 'rpc',
          url: env.string(
            [
              Env.key(project.id, 'RPC_URL_FOR_ACTIVITY'),
              Env.key(project.id, 'RPC_URL'),
            ],
            api.url,
          ),
          callsPerMinute: env.integer(
            [
              Env.key(project.id, 'RPC_CALLS_PER_MINUTE_FOR_ACTIVITY'),
              Env.key(project.id, 'RPC_CALLS_PER_MINUTE'),
            ],
            api.callsPerMinute ?? DEFAULT_RPC_CALLS_PER_MINUTE,
          ),
          adjustCount: project.activityConfig.adjustCount,
          startBlock: project.activityConfig.startBlock,
        }
      } else if (
        api.type === 'loopring' ||
        api.type === 'degate3' ||
        api.type === 'fuel' ||
        api.type === 'zksync' ||
        api.type === 'starknet'
      ) {
        return {
          type: api.type,
          url: env.string(
            [
              Env.key(project.id, 'API_URL_FOR_ACTIVITY'),
              Env.key(project.id, 'API_URL'),
            ],
            api.url,
          ),
          callsPerMinute: env.integer(
            [
              Env.key(project.id, 'API_CALLS_PER_MINUTE_FOR_ACTIVITY'),
              Env.key(project.id, 'API_CALLS_PER_MINUTE'),
            ],
            api.callsPerMinute ?? DEFAULT_RPC_CALLS_PER_MINUTE,
          ),
        }
      }
    }
    throw new Error('Missing appropriate api for activity project')
  } else {
    for (const api of project.chainConfig.apis) {
      if (api.type === 'starkex') {
        return {
          type: 'starkex',
          product: api.product,
          sinceTimestamp: project.activityConfig.sinceTimestamp,
          resyncLastDays:
            project.activityConfig.resyncLastDays ?? DEFAULT_RESYNC_LAST_DAYS,
        }
      }
    }
    throw new Error('Missing appropriate api for activity project')
  }
}
