import type {
  ProjectDefiInfo,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
} from '../types'

/**
 * The l2beat.com page a reviewed project has, or null when it has none, so a
 * link never leads to a missing page. Whether DeFi pages exist depends on the
 * site's feature flags, which only the caller knows.
 */
export function getGardenProjectPath(
  project: {
    slug: string
    privacyInfo?: ProjectPrivacyInfo | undefined
    scalingInfo?: ProjectScalingInfo | undefined
    defiInfo?: ProjectDefiInfo | undefined
  },
  { hasDefiPage }: { hasDefiPage: boolean },
): string | null {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  if (project.defiInfo && hasDefiPage) {
    return `/defi/projects/${project.slug}`
  }
  return null
}
