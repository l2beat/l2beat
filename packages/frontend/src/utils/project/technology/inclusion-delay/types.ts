export interface InclusionDelayModel {
  validatorCount: number
  maxCensorFraction: number
  target: number
  calculateDelayDays: (censorCount: number) => number | null
  criticalCensorCounts: number[]
  /**
   * Whether `calculateDelayDays` is well-defined for a fractional censor count.
   * When true the curve is sampled at a fixed resolution in censoring-fraction
   * space regardless of validator count; when false (e.g. committee models that
   * rely on integer combinatorics) only whole validator counts are sampled.
   */
  supportsFractionalCensorCount: boolean
}
