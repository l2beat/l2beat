import type { OssificationHistory } from '@l2beat/shared/frontend'
import { measureOssification } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import type { OssificationValueSource } from '../projects/ossification/getOssificationSeries'
import type { AuditsOwnReport, AuditsProjectTimeline } from './types'

const MIN_WINDOW = 365 * UnixTime.DAY

/**
 * The project's own audits next to the critical changes of its ossification
 * perimeter. Projects outside that perimeter get the audits alone.
 */
export function getAuditsProjectTimeline(
  audits: AuditsOwnReport[],
  ossification: {
    history: OssificationHistory | undefined
    href: string | undefined
  },
  valueSource: OssificationValueSource | null,
  now: UnixTime,
): AuditsProjectTimeline {
  const measured = ossification.history
    ? measureOssification(ossification.history, now)
    : undefined
  const criticalChanges = measured?.criticalChanges ?? []
  const latestAudit = audits.at(-1) ?? null
  const latestCriticalChange = criticalChanges.at(-1) ?? null
  const firstMarker = Math.min(
    audits[0]?.timestamp ?? Number.POSITIVE_INFINITY,
    criticalChanges[0] ?? Number.POSITIVE_INFINITY,
  )

  return {
    audits,
    criticalChanges,
    hasOssification: measured !== undefined,
    ossificationHref: measured ? ossification.href : undefined,
    latestAudit,
    latestCriticalChange,
    criticalChangesSinceLatestAudit: measured
      ? criticalChanges.filter(
          (timestamp) => !latestAudit || timestamp > latestAudit.timestamp,
        ).length
      : null,
    from: Math.min(now - MIN_WINDOW, firstMarker),
    valueSource,
  }
}
