import type { ProjectPrivacyInfo, ProjectScalingInfo } from '@l2beat/config'

// Unlike getProjectUrl, returns null for a project with no page, such as a
// defi-only one, instead of a /layer2s/projects/ url that 404s.
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
