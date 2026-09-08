import { v } from '@l2beat/validate'
import { auditCoverageSource } from './AuditCoverageSource'
import type { AuditsUnitDetails } from './types'

export const AuditsUnitDetailsParams = v.object({
  slug: v.string(),
  unitId: v.string(),
})
export type AuditsUnitDetailsParams = v.infer<typeof AuditsUnitDetailsParams>

/** Source and diff of one deployed unit, loaded lazily by the project page. */
export function getAuditsUnitDetails(
  params: AuditsUnitDetailsParams,
): AuditsUnitDetails | undefined {
  const report = auditCoverageSource.getProject(params.slug)
  if (!report) return undefined
  for (const contract of report.contracts) {
    for (const file of contract.files) {
      const unit = file.units.find((u) => u.id === params.unitId)
      if (!unit) continue
      return {
        startLine: unit.startLine,
        source: unit.source,
        diff: unit.diff && {
          added: unit.diff.added,
          removed: unit.diff.removed,
          ignoredAdded: unit.diff.ignoredAdded,
          ignoredRemoved: unit.diff.ignoredRemoved,
          ignoredOnly: unit.diff.ignoredOnly,
          hunks: unit.diff.hunks.map((h) => ({
            oldStart: h.oldStart,
            newStart: h.newStart,
            lines: h.lines,
          })),
        },
      }
    }
  }
  return undefined
}
