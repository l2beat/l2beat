import type {
  Project,
  ProjectDefiInfo,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
} from '@l2beat/config'
import { hasDefiProjectPage } from '../defi/project/hasDefiProjectPage'

/**
 * The page a reviewed project has, or null when it has none. The garden links
 * only to pages that exist, so this never falls back to a scaling url the way
 * getProjectUrl does.
 */
export function getGardenProjectPath(project: {
  slug: string
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
  defiInfo?: ProjectDefiInfo | undefined
  ossificationHistory?: Project<'ossificationHistory'>['ossificationHistory']
}): string | null {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  if (project.defiInfo && hasDefiProjectPage(project)) {
    return `/defi/projects/${project.slug}`
  }
  return null
}
