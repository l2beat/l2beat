import type { ProjectAuditCoverage } from '@l2beat/audit-diff'
import { UnixTime } from '@l2beat/shared-pure'
import type { AuditCoverageSource } from './AuditCoverageSource'
import type { AuditsOwnReport } from './types'

/**
 * Every dated report of the project's own collections, matched to deployed
 * code or not, ascending by date. Undated reports have no place on a timeline.
 */
export function getAuditsOwnReports(
  report: ProjectAuditCoverage,
  source: AuditCoverageSource,
): AuditsOwnReport[] {
  const own = new Set(
    report.context.collections
      .filter((c) => c.origin === 'own')
      .map((c) => c.id),
  )
  const matched = new Set(report.reportIds)
  return source
    .listReports()
    .flatMap((ref) => {
      if (!own.has(ref.collection)) return []
      const timestamp = parseReportDate(ref.reportDate, ref.id)
      if (timestamp === undefined) return []
      return [
        {
          id: ref.id,
          title: ref.title,
          auditor: ref.auditor,
          timestamp,
          url: ref.url,
          matched: matched.has(ref.id),
        },
      ]
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}

/**
 * Dataset dates are ISO days. An undated report falls back to the year and
 * month its id ends with, e.g. `consensys-umbra-2021-03`; anything else is
 * treated as undated.
 */
export function parseReportDate(
  reportDate: string | null,
  id?: string,
): UnixTime | undefined {
  const date = reportDate ?? id?.match(/(\d{4}-\d{2}(?:-\d{2})?)$/)?.[1]
  if (!date) return undefined
  const ms = Date.parse(date)
  return Number.isNaN(ms) ? undefined : UnixTime(Math.floor(ms / 1000))
}
