export interface InclusionDelayModel {
  maxCensorFraction: number
  target: number
  /**
   * Inclusion delay as a function of the censoring fraction (0..1). Each model
   * maps the fraction onto its validator set internally, so the chart can be
   * sampled at a fixed fraction resolution regardless of validator count.
   */
  calculateDelayDays: (censoringFraction: number) => number | null
}
