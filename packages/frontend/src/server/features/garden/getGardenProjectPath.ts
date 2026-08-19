import type { ProjectPrivacyInfo, ProjectScalingInfo } from '@l2beat/config'

/**
 * Only privacy and scaling projects have a detail page we can link to. A
 * defi-only project like Uniswap v3 has none, and the shared getProjectUrl
 * helper would resolve it to a /scaling/projects/ URL that 404s.
 */
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
