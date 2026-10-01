import type {
  ExitWindowRisk,
  ProjectPrivacyInfo,
  ProjectScalingRisks,
} from '@l2beat/config'
import type { ProjectOssification } from '@l2beat/shared/frontend'
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
  /** USD·years; null without a value series */
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
  clockStart: number
  /** Perimeter resets inside the window, up to the clock start */
  resets: number[]
  /** Critical changes inside the window, up to the clock start */
  criticalChanges: number
  /** Evenly spread from `from` to `to`, see sampleTimeline */
  values: (number | null)[] | null
}

export interface OssificationStatsProject extends OssificationSeriesProject {
  scalingRisks?: ProjectScalingRisks
  privacyInfo?: ProjectPrivacyInfo
}

export async function getOssificationStats(
  project: OssificationStatsProject,
  ossification: ProjectOssification,
  now: UnixTime,
): Promise<OssificationStats> {
  const clockStart = ossification.projectClockStart
  const from = now - TIMELINE_WINDOW
  // Later ones belong to contracts that have left the perimeter.
  const isInTimeline = (timestamp: number) =>
    timestamp >= from && timestamp <= clockStart
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
    exposure: isUnverified
      ? 0
      : series
        ? calculateExposure(series.points, clockStart, now)
        : null,
    valueSource: series?.source ?? null,
    exitWindow: getExitWindow(project),
    timeline: {
      from,
      to: now,
      clockStart,
      resets: ossification.perimeterResets.filter(isInTimeline),
      criticalChanges: ossification.criticalChanges.filter(isInTimeline).length,
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
