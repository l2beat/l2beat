import type { AuditsUnitEntry } from '~/server/features/audits/types'
import { hasUnresolvedMajorFinding } from './auditStatus'

export interface GroupedUnits {
  /**
   * Units shown as full rows, most actionable first: no audited source,
   * then differing from the audited code, then identical to audited code
   * that still has an unresolved major finding.
   */
  rows: AuditsUnitEntry[]
  /** Units identical to audited code, listed compactly by name. */
  audited: AuditsUnitEntry[]
}

/**
 * Splits the units of a source for display. Within each group the input
 * (flat file) order is kept, so related units stay adjacent.
 */
export function groupUnitsForDisplay(units: AuditsUnitEntry[]): GroupedUnits {
  const unaudited: AuditsUnitEntry[] = []
  const differs: AuditsUnitEntry[] = []
  const majorFinding: AuditsUnitEntry[] = []
  const audited: AuditsUnitEntry[] = []
  for (const unit of units) {
    if (unit.status === 'unaudited') unaudited.push(unit)
    else if (unit.status === 'differs') differs.push(unit)
    else if (hasUnresolvedMajorFinding(unit)) majorFinding.push(unit)
    else audited.push(unit)
  }
  return { rows: [...unaudited, ...differs, ...majorFinding], audited }
}
