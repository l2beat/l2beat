import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import {
  getScalingProjectEntry,
  type ProjectScalingEntry,
} from '../../scaling/project/getScalingProjectEntry'

export type ProjectEntry = ProjectScalingEntry

export async function getUnifiedProject(slug: string) {
  return await ps.getProject({
    slug,
    select: ['display', 'statuses'],
    optional: [
      // scaling facet
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'livenessInfo',
      'livenessConfig',
      'customDa',
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
}

export type UnifiedProject = NonNullable<
  Awaited<ReturnType<typeof getUnifiedProject>>
>

export async function getProjectEntry(
  project: UnifiedProject,
  helpers: SsrHelpers,
): Promise<ProjectEntry | undefined> {
  const scalingProject = getScalingFacet(project)
  if (scalingProject) {
    return await getScalingProjectEntry(scalingProject, helpers)
  }
  return undefined
}

function getScalingFacet(project: UnifiedProject) {
  if (
    !project.scalingInfo ||
    !project.scalingRisks ||
    !project.scalingStage ||
    !project.scalingTechnology ||
    !project.tvsInfo
  ) {
    return undefined
  }
  return project as Parameters<typeof getScalingProjectEntry>[0]
}
