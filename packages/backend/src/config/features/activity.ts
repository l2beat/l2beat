import { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import type { ActivityConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getActivityConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
): Promise<ActivityConfig> {
  const projects = await ps.getProjects({
    select: ['activityConfig', 'chainConfig'],
    whereNot: ['archivedAt'],
  })

  return {
    projects: projects
      .filter((p) => flags.isEnabled('activity', p.id))
      .map((p) => ({
        id: p.id,
        chainName: p.chainConfig.name,
        activityConfig: {
          ...p.activityConfig,
          ...(p.activityConfig.type === 'block'
            ? {
                batchSize:
                  env.optionalInteger(
                    Env.key(p.chainConfig.name, 'ACTIVITY_BATCH_SIZE'),
                  ) ?? p.activityConfig.batchSize,
              }
            : {}),
        },
      })),
  }
}
