import type { ProjectPrivacyInfo, ProjectScalingInfo } from '@l2beat/config'

/**
 * The page a reviewed project has, or null when it has none. The garden links
 * only to pages that exist, so this never falls back to a scaling url the way
 * getProjectUrl does.
 */
export function getGardenProjectPath(project: {
  slug: string
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
}): string | null {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  return null
}
