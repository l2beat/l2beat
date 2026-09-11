import type { ProjectPrivacyInfo, ProjectScalingInfo } from '../types'

/**
 * The page a reviewed project has on l2beat.com, or null when it has none.
 * The garden and the API link only to pages that exist, so this never falls
 * back to a scaling url the way the frontend's getProjectUrl does.
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
