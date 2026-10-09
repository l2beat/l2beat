import type { ProjectAuditCoverage } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import {
  reportCollection,
  reportOrigin,
  reportUrl,
} from './coverage/coverageReports'
import type { AuditsProjectReport } from './types'

/**
 * The dated reports that count as the project's audits, ascending by date:
 * every report of its own collection, matched to deployed code or not, and
 * the matched reports of its stack collection. Library audits and the
 * reports of other projects do not count. Undated reports have no place on a
 * timeline.
 * See docs/superpowers/specs/2026-10-07-audit-timeline-project-audits-design.md.
 */
export function getAuditsProjectReports(
  coverage: ProjectAuditCoverage,
  projectId: string,
  stackCollection: string | undefined,
  matched: Set<string>,
): AuditsProjectReport[] {
  return Object.entries(coverage.reports)
    .flatMap(([id, report]): AuditsProjectReport[] => {
      const origin = reportOrigin(id, coverage, projectId, stackCollection)
      if (origin !== 'own' && origin !== 'stack') return []
      const isMatched = matched.has(id)
      if (origin === 'stack' && !isMatched) return []
      const timestamp = parseReportDate(report.date ?? null, id)
      if (timestamp === undefined) return []
      const collection = reportCollection(id, coverage)
      return [
        {
          id,
          title: report.title,
          auditor: report.auditor,
          timestamp,
          url: reportUrl(coverage, id),
          origin,
          collectionName: coverage.collections[collection]?.name ?? collection,
          matched: isMatched,
        },
      ]
    })
    .sort((a, b) => a.timestamp - b.timestamp || a.id.localeCompare(b.id))
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
