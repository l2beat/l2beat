import type { ProjectPrivacyInfo, ProjectScalingInfo } from '@l2beat/config'

// Unlike getProjectUrl, returns undefined for a project with no page, such as
// a defi-only one, instead of a /scaling/projects/ url that 404s.
export function getGardenProjectPath(project: {
  slug: string
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
}): string | undefined {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/scaling/projects/${project.slug}`
  }
  return undefined
}
