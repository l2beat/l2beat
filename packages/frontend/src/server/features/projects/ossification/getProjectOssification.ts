import {
  measureOssification,
  type OssificationFactor,
  type ProjectOssificationInfo,
} from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import {
  type BattleTestedExposurePoint,
  calculateBattleTestedExposure,
} from './calculateBattleTestedExposure'

/** The mini timeline covers a trailing year. Long enough to hold a full
 *  governance cycle, short enough that a single event stays distinguishable at
 *  table-cell width. */
const TIMELINE_WINDOW_SECONDS = 365 * 24 * 60 * 60
/** Weekly resolution — roughly one sample per 2.5 pixels of the rendered cell. */
const TIMELINE_SAMPLES = 52

export interface ProjectOssification extends OssificationFactor {
  /** Project TVS integrated over the current unchanged period, in USD·years. */
  exposure: number | null
  timeline: OssificationTimeline
}

/** Input for the summary table's mini timeline. The window is identical for
 *  every project so the cells can be read against each other; only the TVS
 *  height is normalized per project. */
export interface OssificationTimeline {
  from: number
  to: number
  /** Start of the unchanged period. May predate `from`. */
  clockStart: number
  /** Clustered perimeter resets inside the window, ascending. */
  resets: number[]
  /** TVS sampled at `TIMELINE_SAMPLES` points spaced evenly from `from` to
   *  `to` inclusive, so an index maps straight onto the x axis. Null entries
   *  precede the start of the series; null altogether when the project has no
   *  TVS data (or in mock mode). */
  tvs: (number | null)[] | null
}

/**
 * The perimeter history is computed when the config package is built (see
 * packages/config/src/ossification); this adds what depends on now and on the
 * database: ages, score, change rate, and the TVS exposure.
 */
export async function getProjectOssification(
  projectId: string,
): Promise<ProjectOssification | undefined> {
  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['ossificationInfo'],
  })
  if (!project) return undefined
  return await measureProjectOssification(projectId, project.ossificationInfo)
}

export async function measureProjectOssification(
  projectId: string,
  info: ProjectOssificationInfo,
): Promise<ProjectOssification> {
  const now = UnixTime.now()
  const factor = measureOssification(info, now)
  const from = now - TIMELINE_WINDOW_SECONDS
  const series = await getTvsSeries(
    projectId,
    factor.projectClockStart,
    from,
    now,
  )
  return {
    ...factor,
    exposure: getExposure(series, factor, now),
    timeline: {
      from,
      to: now,
      clockStart: factor.projectClockStart,
      resets: factor.perimeterResets.filter((reset) => reset >= from),
      tvs: series && sampleSeries(series, from, now),
    },
  }
}

/** One query serves both consumers: the exposure integral reaches back to the
 *  clock start, the timeline only needs the trailing window. Whichever is
 *  older sets the range. */
async function getTvsSeries(
  projectId: string,
  clockStart: number,
  from: number,
  to: number,
): Promise<BattleTestedExposurePoint[] | null> {
  if (env.MOCK) return null

  const repository = getDb().tvsTokenValue
  const anchor = Math.min(from, clockStart)
  // A sample at or before the anchor lets both consumers start from a known
  // value instead of the first in-range one.
  const precedingTimestamp =
    await repository.getMaxTimestampAtOrBeforeForProjects(UnixTime(anchor), [
      projectId,
    ])
  const rows = await repository.getSummedByTimestampByProjects(
    [projectId],
    precedingTimestamp ?? UnixTime(anchor),
    UnixTime(to),
    {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )
  // The query does not order its rows; both consumers below assume ascending.
  return rows
    .map((row) => ({
      timestamp: Number(row.timestamp),
      value: Number(row.value),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
}

/** ∫ TVS dt from the project clock start to now, in USD·years. Shares the
 * unverified gate with the score: an unverified perimeter accumulates
 * nothing. Samples before the clock start are clipped by the integral. */
function getExposure(
  series: BattleTestedExposurePoint[] | null,
  factor: OssificationFactor,
  now: number,
): number | null {
  if (series === null) return null
  if (factor.maturity === 0) return 0
  return calculateBattleTestedExposure(series, factor.projectClockStart, now)
}

/** Point-in-time samples on a fixed grid: the last known value at each grid
 *  timestamp, or null while the series has not started. */
function sampleSeries(
  series: readonly BattleTestedExposurePoint[],
  from: number,
  to: number,
): (number | null)[] | null {
  const step = (to - from) / (TIMELINE_SAMPLES - 1)
  const values: (number | null)[] = []
  let cursor = 0
  let current: number | null = null
  for (let index = 0; index < TIMELINE_SAMPLES; index++) {
    const at = from + index * step
    while (cursor < series.length) {
      const point = series[cursor]
      if (point === undefined || point.timestamp > at) break
      current = point.value
      cursor++
    }
    values.push(current)
  }
  return values.some((value) => value !== null) ? values : null
}
