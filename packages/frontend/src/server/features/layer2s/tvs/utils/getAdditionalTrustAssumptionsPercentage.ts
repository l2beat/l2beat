export function getAdditionalTrustAssumptionsPercentage({
  total,
  customCanonical,
  external,
}: {
  total: number
  customCanonical: number
  external: number
}) {
  return total !== 0 ? (customCanonical + external) / total : 0
}
