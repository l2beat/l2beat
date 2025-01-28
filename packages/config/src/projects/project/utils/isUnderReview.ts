import type {
  Bridge,
  Layer2,
  Layer3,
  ScalingProjectRiskViewEntry,
} from '../../../types'

// this function should be updated when new sections that can be under review are added
export function isUnderReview(project: Layer2 | Bridge | Layer3): boolean {
  return (
    !!project.isUnderReview ||
    (project.type === 'layer2' && project.stage.stage === 'UnderReview') ||
    !!project.technology.isUnderReview ||
    !!project.contracts?.isUnderReview ||
    project.permissions === 'UnderReview' ||
    Object.values(project.riskView).some(
      (risk: ScalingProjectRiskViewEntry) => risk.sentiment === 'UnderReview',
    )
  )
}
