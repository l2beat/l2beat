import { type Layer2 } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export function getCommonScalingEntry({
  project,
  verificationStatus,
  implementationChangeReport,
}: {
  project: Layer2
  verificationStatus: VerificationStatus
  implementationChangeReport: ImplementationChangeReportApiResponse
}) {
  const isVerified = !!verificationStatus.projects[project.id.toString()]
  const hasImplementationChanged =
    !!implementationChangeReport.projects[project.id.toString()]

  return {
    type: project.type,
    category: project.display.category,
    stage: project.type === 'layer2' ? project.stage : undefined,
    provider: project.display.provider,
    purposes: project.display.purposes,
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    href: `/scaling/projects/${project.display.slug}`,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    hasImplementationChanged,
  }
}
