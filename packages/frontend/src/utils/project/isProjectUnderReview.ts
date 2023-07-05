import { Bridge, BridgeRiskView, Layer2, Layer2RiskView } from '@l2beat/config'

export function isProjectUnderReview(project: Layer2 | Bridge): boolean {
  return (
    project.isUnderReview ??
    project.technology.isUnderReview ??
    project.contracts?.isUnderReview ??
    isAnyRiskUnderReview(project.riskView) ??
    ((project.type === 'layer2' && project.stage?.stage === 'UnderReview') ||
      project.permissions === 'UnderReview')
  )
}

export function isAnyRiskUnderReview(
  riskView?: Layer2RiskView | BridgeRiskView,
) {
  return (
    riskView && Object.values(riskView).some((value) => value === 'UnderReview')
  )
}
