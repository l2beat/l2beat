import type { ProjectAuditCoverage, ProjectAuditScope } from '@l2beat/config'
import type { AuditReading } from '../types'

/**
 * The coverage as one reading of the audit reports sees it. Strict counts
 * only code a report explicitly includes; relaxed also counts code its named
 * code depends on. Units the scope does not know keep their base result. See
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
export function coverageUnderReading(
  coverage: ProjectAuditCoverage,
  scope: ProjectAuditScope,
  reading: AuditReading,
): {
  coverage: ProjectAuditCoverage
  /** Unit id to the reports that only imply its matched code. */
  impliedBy: Map<string, string[]>
  /** Audited files that are read from their own repository, not the dataset. */
  upstream: Set<string>
} {
  const units = { ...coverage.units }
  const impliedBy = new Map<string, string[]>()
  for (const [id, entry] of Object.entries(scope.units)) {
    if (units[id] === undefined) continue
    if (reading === 'strict' || entry.relaxed === undefined) {
      units[id] = entry.strict
      continue
    }
    const { impliedBy: reports, ...unit } = entry.relaxed
    units[id] = unit
    // Worth a label only where the implied code is what the result rests on.
    const restsOnImplied =
      unit.status !== entry.strict.status ||
      unit.covered !== entry.strict.covered ||
      unit.audited?.object !== entry.strict.audited?.object
    if (reports.length > 0 && restsOnImplied) impliedBy.set(id, reports)
  }
  const upstream = new Set(
    Object.entries(scope.auditedFiles)
      .filter(([, file]) => file.upstream)
      .map(([object]) => object),
  )
  return {
    coverage: {
      ...coverage,
      units,
      auditedFiles: { ...coverage.auditedFiles, ...scope.auditedFiles },
      reports: { ...coverage.reports, ...scope.reportInfo },
      collections: { ...coverage.collections, ...scope.collections },
    },
    impliedBy,
    upstream,
  }
}
