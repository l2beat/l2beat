import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import {
  getScalingProjectEntry,
  type ProjectScalingEntry,
  SCALING_PROJECT_FACET_KEYS,
  SCALING_PROJECT_OPTIONAL_KEYS,
  type ScalingProject,
} from '../../scaling/project/getScalingProjectEntry'

export async function getUnifiedProject(slug: string) {
  return await ps.getProject({
    slug,
    select: ['display', 'statuses'],
    optional: [...SCALING_PROJECT_FACET_KEYS, ...SCALING_PROJECT_OPTIONAL_KEYS],
  })
}

type UnifiedProject = NonNullable<Awaited<ReturnType<typeof getUnifiedProject>>>

export async function getProjectEntry(
  project: UnifiedProject,
  helpers: SsrHelpers,
): Promise<ProjectScalingEntry | undefined> {
  const scalingProject = getScalingFacet(project)
  if (scalingProject) {
    return await getScalingProjectEntry(scalingProject, helpers)
  }
  return undefined
}

function getScalingFacet(project: UnifiedProject) {
  const hasScalingFacet = SCALING_PROJECT_FACET_KEYS.every(
    (key) => project[key] !== undefined,
  )
  return hasScalingFacet ? (project as ScalingProject) : undefined
}
