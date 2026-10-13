import type { OssificationHistory } from '@l2beat/shared/frontend'
import { measureOssification } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import type {
  AuditsOtherReport,
  AuditsProjectReport,
  AuditsProjectTimeline,
  AuditsSummaryTimeline,
} from './types'

const MIN_WINDOW = 365 * UnixTime.DAY

export interface AuditsTimelineSources {
  /** The project's audits, own and stack, ascending. See getAuditsProjectReports. */
  audits: AuditsProjectReport[]
  /** Dated matched reports that are not project audits, any order. */
  otherAudits: AuditsOtherReport[]
  ossification: {
    history: OssificationHistory | undefined
    href: string | undefined
  }
  /** See getAuditsLaunch. */
  launch: number | null
}

/**
 * The project's audits, own and stack, next to the critical changes of its
 * ossification perimeter, from its launch to now. Projects outside that
 * perimeter get the audits alone. Other matched reports are carried along
 * for the chart's toggle and take no part in the statistics.
 */
export function getAuditsProjectTimeline(
  sources: AuditsTimelineSources,
  now: UnixTime,
): AuditsProjectTimeline {
  const { audits, ossification, launch } = sources
  const measured = ossification.history
    ? measureOssification(ossification.history, now)
    : undefined
  const criticalChanges = measured?.criticalChanges ?? []
  const latestAudit = audits.at(-1) ?? null
  const intervalStart = Math.min(
    launch ?? Number.POSITIVE_INFINITY,
    audits.find((audit) => audit.origin === 'own')?.timestamp ??
      Number.POSITIVE_INFINITY,
  )
  const auditsSinceStart = audits.filter(
    (audit) => audit.timestamp >= intervalStart,
  ).length

  return {
    audits,
    otherAudits: [...sources.otherAudits].sort(
      (a, b) => a.timestamp - b.timestamp,
    ),
    criticalChanges,
    hasOssification: measured !== undefined,
    ossificationHref: measured ? ossification.href : undefined,
    launch,
    latestAudit,
    auditInterval:
      auditsSinceStart > 0
        ? {
            start: intervalStart,
            audits: auditsSinceStart,
            average: Math.max(0, now - intervalStart) / auditsSinceStart,
          }
        : null,
    averageUpgradeInterval:
      measured && launch !== null && criticalChanges.length > 0
        ? Math.max(0, now - launch) / criticalChanges.length
        : null,
    criticalChangesSinceLatestAudit: measured
      ? criticalChanges.filter(
          (timestamp) => !latestAudit || timestamp > latestAudit.timestamp,
        ).length
      : null,
    from: Math.min(
      now - MIN_WINDOW,
      launch ?? Number.POSITIVE_INFINITY,
      audits[0]?.timestamp ?? Number.POSITIVE_INFINITY,
      criticalChanges[0] ?? Number.POSITIVE_INFINITY,
    ),
    to: now,
  }
}

/** The dashboard sparkline shows the same timeline with less detail. */
export function toAuditsSummaryTimeline(
  timeline: AuditsProjectTimeline,
): AuditsSummaryTimeline {
  return {
    from: timeline.from,
    to: timeline.to,
    launch: timeline.launch,
    audits: timeline.audits.map((audit) => audit.timestamp),
    latestAudit: timeline.latestAudit?.timestamp ?? null,
    criticalChangesSinceLatestAudit: timeline.criticalChangesSinceLatestAudit,
  }
}

/**
 * When the project went live: the start of its ossification perimeter, which
 * is the project's start or the earliest critical deployment, else the start
 * of its chain.
 */
export function getAuditsLaunch(project: {
  ossificationHistory?: OssificationHistory
  chainConfig?: { sinceTimestamp?: UnixTime }
}): number | null {
  return (
    project.ossificationHistory?.observedSince ??
    project.chainConfig?.sinceTimestamp ??
    null
  )
}
