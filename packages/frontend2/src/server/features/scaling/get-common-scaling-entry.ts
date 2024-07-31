import { type Bridge, type Layer3, type Layer2 } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export function getCommonScalingEntry({
  project,
  isVerified,
  hasImplementationChanged,
}: {
  project: Layer2 | Layer3
  isVerified: boolean
  hasImplementationChanged: boolean
}) {
  return {
    name: project.display.name,
    href: `/scaling/projects/${project.display.slug}`,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    type: project.type,
    provider: project.display.provider,
    warning: project.display.warning,
    isVerified,
    hasImplementationChanged,
    showProjectUnderReview: isAnySectionUnderReview(project),
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: project.type === 'layer2' ? project.stage : undefined,
  }
}
