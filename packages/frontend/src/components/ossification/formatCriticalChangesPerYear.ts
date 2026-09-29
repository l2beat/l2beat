export function formatCriticalChangesPerYear({
  criticalChangesPerYear,
  clusteredEventCount,
}: {
  criticalChangesPerYear: number
  clusteredEventCount: number
}): string {
  if (clusteredEventCount === 0) {
    return '0'
  }
  return criticalChangesPerYear < 10
    ? criticalChangesPerYear.toFixed(1)
    : Math.round(criticalChangesPerYear).toString()
}
