export interface PrivacyMetricCoverage {
  attributed: number
  total: number
}

export function describePrivacyMetricCoverage(
  coverage: PrivacyMetricCoverage,
  operations: string,
): string {
  const percentage =
    coverage.total === 0
      ? undefined
      : Math.round((100 * coverage.attributed) / coverage.total)
  return `Attributed ${coverage.attributed.toLocaleString('en-US')} of ${coverage.total.toLocaleString('en-US')} ${operations}${percentage === undefined ? '' : ` (${percentage}%)`}.`
}
