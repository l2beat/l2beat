export interface InclusionDelaySeriesPoint {
  censoringFraction: number
  /** Delay in seconds. Null means the target percentile is not reached by the model. */
  projectDelaySeconds: number | null
  /** Delay in seconds. Null means the target percentile is not reached by the model. */
  ethereumComparisonDelaySeconds: number | null
}

export interface EntityStakeMarker {
  id: string
  label: string
  entityCount: number
  entityNames: string[]
  stakeFraction: number
  /** Delay in seconds. Null means the marker is outside the finite-delay chart range. */
  delaySeconds: number | null
}

export interface DelayThresholdMarker {
  id: string
  label: string
  censoringFraction: number
  /** Delay in seconds. */
  delaySeconds: number
}

export interface DelayThreshold {
  label: string
  seconds: number
}
