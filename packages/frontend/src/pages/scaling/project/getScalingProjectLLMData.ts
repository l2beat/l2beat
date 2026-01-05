import { getScalingProjectEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { ps } from '~/server/projects'
import { getSsrHelpers } from '~/trpc/server'
import { formatProjectForLLM } from './formatProjectForLLM'

export async function getScalingProjectLLMData(
  slug: string,
): Promise<string | undefined> {
  const helpers = getSsrHelpers()
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'livenessInfo',
      'livenessConfig',
      'customDa',
      'isUpcoming',
      'archivedAt',
      'milestones',
      'trackedTxsConfig',
      'tvsConfig',
      'colors',
      'ecosystemColors',
      'discoveryInfo',
      'daTrackingConfig',
      'costsInfo',
      'activityConfig',
    ],
  })
  if (!project) return undefined

  const projectEntry = await getScalingProjectEntry(project, helpers)
  return formatProjectForLLM(projectEntry)
}


