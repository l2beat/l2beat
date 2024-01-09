import {
  Bridge,
  BridgeRiskView,
  Layer2,
  Layer3,
  ProjectRiskView,
  ProjectRiskViewEntry,
} from '@l2beat/config'

// this function should be updated when new sections that can be under review are added
export function isAnySectionUnderReview(
  project: Layer2 | Bridge | Layer3,
): boolean {
  return (
    project.isUnderReview ??
    project.technology.isUnderReview ??
    project.contracts?.isUnderReview ??
    isAnyRiskUnderReview(project.riskView) ??
    ((project.type === 'layer2' && project.stage.stage === 'UnderReview') ||
      project.permissions === 'UnderReview')
  )
}

export function isAnyRiskUnderReview(
  riskView?: ProjectRiskView | BridgeRiskView,
) {
  return (
    riskView &&
    Object.values(riskView as Record<string, ProjectRiskViewEntry>).some(
      (risk) => risk.sentiment === 'UnderReview',
    )
  )
}
