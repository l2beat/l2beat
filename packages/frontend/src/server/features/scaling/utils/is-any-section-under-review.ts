import {
  type Bridge,
  type BridgeRiskView,
  type Layer2,
  type Layer3,
  type ScalingProjectRiskView,
  type ScalingProjectRiskViewEntry,
} from '@l2beat/config'

// this function should be updated when new sections that can be under review are added
export function isAnySectionUnderReview(
  project: Layer2 | Bridge | Layer3,
): boolean {
  return !!(
    ((project.type === 'layer2' && project.stage.stage === 'UnderReview') ||
      project.isUnderReview) ??
    project.technology.isUnderReview ??
    project.contracts?.isUnderReview ??
    (project.permissions === 'UnderReview' ||
      isAnyRiskUnderReview(project.riskView))
  )
}

export function isAnyRiskUnderReview(
  riskView?: ScalingProjectRiskView | BridgeRiskView,
) {
  return (
    riskView &&
    Object.values(riskView).some(
      (risk) =>
        (risk as ScalingProjectRiskViewEntry).sentiment === 'UnderReview',
    )
  )
}
