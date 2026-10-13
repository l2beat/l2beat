import { pluralize } from '@l2beat/shared-pure'

export function formatCriticalChangesPerYear({
  criticalChangesPerYear,
}: {
  criticalChangesPerYear: number
}): string {
  if (criticalChangesPerYear === 0) {
    return '0'
  }
  return criticalChangesPerYear < 10
    ? criticalChangesPerYear.toFixed(1)
    : Math.round(criticalChangesPerYear).toString()
}

/** The second line under the change rate: the size of the perimeter. */
export function formatContractCount(contractCount: number): string {
  return `across ${contractCount} ${pluralize(contractCount, 'contract')}`
}
