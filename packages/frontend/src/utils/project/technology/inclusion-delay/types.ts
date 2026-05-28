export interface InclusionDelayModel {
  validatorCount: number
  maxCensorFraction: number
  target: number
  calculateDelayDays: (censorCount: number) => number | null
  criticalCensorCounts: number[]
}
