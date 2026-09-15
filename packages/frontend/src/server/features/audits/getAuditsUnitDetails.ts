import { v } from '@l2beat/validate'
import { auditCoverageSource } from './AuditCoverageSource'
import type { AuditsUnitDetails } from './types'

export const AuditsUnitDetailsParams = v.object({
  unitHash: v.string(),
  contextKey: v.string(),
  startLine: v.number(),
})
export type AuditsUnitDetailsParams = v.infer<typeof AuditsUnitDetailsParams>

/** Source and diff of one deployed unit, loaded lazily by the project page. */
export function getAuditsUnitDetails(
  params: AuditsUnitDetailsParams,
): AuditsUnitDetails | undefined {
  const record = auditCoverageSource.getUnit(params.unitHash)
  if (!record) return undefined
  const resolution =
    record.resolutions[params.contextKey] ??
    Object.values(record.resolutions)[0]
  return {
    startLine: params.startLine,
    source: record.source,
    diff: resolution?.diff && {
      added: resolution.diff.added,
      removed: resolution.diff.removed,
      ignoredAdded: resolution.diff.ignoredAdded,
      ignoredRemoved: resolution.diff.ignoredRemoved,
      ignoredOnly: resolution.diff.ignoredOnly,
      hunks: resolution.diff.hunks.map((h) => ({
        oldStart: h.oldStart,
        newStart: h.newStart,
        lines: h.lines,
      })),
    },
  }
}
