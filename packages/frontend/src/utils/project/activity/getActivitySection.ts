import type { Project } from '@l2beat/config'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'
import { env } from '~/env'
import { hasLiveActivity } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import { checkIfActivityExists } from '~/server/features/layer2s/activity/utils/checkIfActivityExists'
import { optionToRange } from '~/utils/range/range'

export async function getActivitySection(
  project: Project<never, 'archivedAt' | 'activityConfig'>,
): Promise<
  | Pick<ActivitySectionProps, 'defaultRange' | 'dataSource' | 'hasLive'>
  | undefined
> {
  if (!project.activityConfig) return undefined

  const rangeOption = project.archivedAt ? 'max' : '1y'
  const range = optionToRange(rangeOption)
  const hasData = await checkIfActivityExists(project.id, range[0] ?? undefined)
  if (!hasData) {
    return undefined
  }

  return {
    defaultRange: range,
    dataSource:
      project.activityConfig.type === 'day' ||
      project.activityConfig.type === 'hour'
        ? project.activityConfig.dataSource
        : undefined,
    hasLive:
      env.CLIENT_SIDE_LIVE_ACTIVITY &&
      !project.archivedAt &&
      project.activityConfig.type === 'block' &&
      (await hasLiveActivity(project.id)),
  }
}
