import type { ProjectAuditCoverage } from '@l2beat/audit-diff'
import { UnixTime } from '@l2beat/shared-pure'
import type { AuditCoverageSource } from './AuditCoverageSource'
import type { AuditsProjectReport } from './types'

/**
 * The dated reports that count as the project's audits, ascending by date:
 * every report of its own collections, matched to deployed code or not, and
 * the matched reports of its upstream and stack project collections. Library
 * collections ranked as stack through a template hint do not count, nor do
 * the reports of projects outside the ranked context. Undated reports have
 * no place on a timeline.
 * See docs/superpowers/specs/2026-10-07-audit-timeline-project-audits-design.md.
 */
export function getAuditsProjectReports(
  report: ProjectAuditCoverage,
  source: AuditCoverageSource,
): AuditsProjectReport[] {
  const origins = new Map<string, AuditsProjectReport['origin']>()
  for (const collection of report.context.collections) {
    if (collection.origin === 'own') {
      origins.set(collection.id, 'own')
    } else if (
      (collection.origin === 'upstream' || collection.origin === 'stack') &&
      source.getCollection(collection.id)?.kind === 'project'
    ) {
      origins.set(collection.id, collection.origin)
    }
  }
  const matchedIds = new Set(report.reportIds)
  return source
    .listReports()
    .flatMap((ref) => {
      const origin = origins.get(ref.collection)
      if (origin === undefined) return []
      const matched = matchedIds.has(ref.id)
      if (origin !== 'own' && !matched) return []
      const timestamp = parseReportDate(ref.reportDate, ref.id)
      if (timestamp === undefined) return []
      return [
        {
          id: ref.id,
          title: ref.title,
          auditor: ref.auditor,
          timestamp,
          url: ref.url,
          origin,
          collectionName:
            source.getCollection(ref.collection)?.name ?? ref.collection,
          matched,
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
