import type {
  ExitWindowRisk,
  ProjectPrivacyInfo,
  ProjectScalingRisks,
} from '@l2beat/config'
import type { OssificationResult } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import { calculateExposure } from './calculateExposure'
import {
  getOssificationSeries,
  type OssificationSeriesProject,
  type OssificationValueSource,
} from './getOssificationSeries'
import { sampleTimeline } from './sampleTimeline'

const TIMELINE_WINDOW = 365 * UnixTime.DAY

/** What the ossification table and the detail block both show. */
export interface OssificationStats {
  score: number
  isUnverified: boolean
  criticalChangesPerYear: number
  clusteredEventCount: number
  contractCount: number
  /** USD·years; null without a value series or with unverified contracts */
  exposure: number | null
  valueSource: OssificationValueSource | null
  /** Absent for DeFi, which has no exit window in config yet */
  exitWindow?: OssificationExitWindow
  timeline: OssificationTimeline
}

type OssificationExitWindow = Pick<
  ExitWindowRisk,
  'value' | 'sentiment' | 'description' | 'warning' | 'regular' | 'orderHint'
>

interface OssificationTimeline {
  from: number
  to: number
  /** Start of the clock, the unchanged period */
  clockStart: number
  /** Start of the first clock, possibly before `from` */
  genesis: number
  /** 24h-clustered critical changes inside the window */
  criticalChanges: number[]
  /** Evenly spread from `from` to `to`, see sampleTimeline */
  values: (number | null)[] | null
}

export interface OssificationStatsProject extends OssificationSeriesProject {
  scalingRisks?: ProjectScalingRisks
  privacyInfo?: ProjectPrivacyInfo
}

export async function getOssificationStats(
  project: OssificationStatsProject,
  ossification: OssificationResult,
  now: UnixTime,
): Promise<OssificationStats> {
  const clockStart = ossification.clockStart
  const from = now - TIMELINE_WINDOW
  // One read covers both the exposure since the clock start and the timeline.
  const series = await getOssificationSeries(
    project,
    Math.min(from, clockStart),
  )
  const isUnverified = ossification.contracts.some((c) => !c.isVerified)

  return {
    score: ossification.score,
    isUnverified,
    criticalChangesPerYear: ossification.criticalChangesPerYear,
    clusteredEventCount: ossification.clusteredEventCount,
    contractCount: ossification.contracts.length,
    // Unaudited code has withstood nothing we can vouch for.
    exposure:
      series && !isUnverified
        ? calculateExposure(series.points, clockStart, now)
        : null,
    valueSource: series?.source ?? null,
    exitWindow: getExitWindow(project),
    timeline: {
      from,
      to: now,
      clockStart,
      genesis: ossification.genesis,
      criticalChanges: ossification.criticalChanges.filter((t) => t >= from),
      values: series ? sampleTimeline(series.points, from, now) : null,
    },
  }
}

function getExitWindow(
  project: OssificationStatsProject,
): OssificationExitWindow | undefined {
  const risk = project.scalingRisks
    ? (project.scalingRisks.stacked ?? project.scalingRisks.self).exitWindow
    : project.privacyInfo?.exitWindow
  if (!risk) {
    return undefined
  }
  const { value, sentiment, description, warning, regular, orderHint } = risk
  return { value, sentiment, description, warning, regular, orderHint }
}
