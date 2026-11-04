import type { ProjectAuditCoverage } from '@l2beat/config'
import { toReportRef } from './coverage/coverageReports'
import type { AuditsCoverageHistory, AuditsCoverageHistoryPoint } from './types'

/**
 * The coverage history as the chart shows it, or undefined for a coverage
 * generated without one. Reports are linked like everywhere else; the raw
 * `none` status is shown as unaudited.
 */
export function getAuditsCoverageHistory(
  coverage: ProjectAuditCoverage,
  projectId: string,
  stackCollection: string | undefined,
): AuditsCoverageHistory | undefined {
  const history = coverage.history
  if (history === undefined) return undefined
  const ref = (id: string) =>
    toReportRef(coverage, id, projectId, stackCollection)
  return {
    launch: history.launch,
    points: history.points.map(
      (point): AuditsCoverageHistoryPoint => ({
        timestamp: point.timestamp,
        percent:
          point.lines.total === 0
            ? 0
            : (100 * point.lines.covered) / point.lines.total,
        lines: {
          ...point.lines,
          uncovered: point.lines.total - point.lines.covered,
        },
        units: {
          identical: point.units.identical,
          differs: point.units.differs,
          unaudited: point.units.none,
        },
        contracts: point.contracts,
        withoutSource: point.withoutSource,
        reports: (point.reports ?? []).map(ref),
        changes: point.changes ?? [],
      }),
    ),
    undatedReports: history.undatedReports.map(ref),
  }
}
