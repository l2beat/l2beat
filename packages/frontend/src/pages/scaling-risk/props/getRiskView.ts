import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared'

import {
  ScalingRiskViewEntry,
  ScalingRiskViewProps,
} from '../view/ScalingRiskView'

export function getRiskView(
  projects: Layer2[],
  verificationStatus: VerificationStatus,
  upcomingEnabled: boolean,
): ScalingRiskViewProps {
  return {
    items: projects.map((p) =>
      getRiskViewEntry(p, verificationStatus.projects[p.id.toString()]),
    ),
    upcomingEnabled,
  }
}

export function getRiskViewEntry(
  project: Layer2,
  isVerified?: boolean,
): ScalingRiskViewEntry {
  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    warning: project.display.warning,
    isArchived: project.isArchived,
    isVerified,
    isUpcoming: project.isUpcoming,
    ...project.riskView,
  }
}
