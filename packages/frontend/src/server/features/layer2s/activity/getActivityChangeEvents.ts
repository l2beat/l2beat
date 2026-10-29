import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { manifest } from '~/utils/Manifest'
import type { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  ACTIVITY_CHANGE_CATEGORIES,
  BASELINE_DAYS,
} from './utils/activityChangeConstants'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'
import { createActivityProjectsFilter } from './utils/projectFilterUtils'

export type ActivityChangeCategory = (typeof ACTIVITY_CHANGE_CATEGORIES)[number]
export type ActivityChangeMetric = 'uops' | 'tps'

const MIN_BASELINE_OBSERVATIONS = 21
const MAX_CONTRIBUTORS = 3
// A change is notable only when it clears every bar: unusual for the category
// (robust z), big for the category (relative), and big for the whole chart
// (absolute and share of all L2 activity), so small series don't fire on noise.
const MIN_ROBUST_Z = 4
const MIN_RELATIVE_CHANGE = 0.2
const MIN_ABSOLUTE_CHANGE = 5 * UnixTime.DAY
const MIN_SHARE_OF_ALL_L2 = 0.01
// Flat histories give huge z-scores; cap it so ranking follows size.
const MAX_RANKING_Z = 50
// A calm day or two inside a surge shouldn't split it into two events.
const MAX_EPISODE_GAP = 3 * UnixTime.DAY

const cache = new FrontendInMemoryCache('getActivityChangeEvents')

export interface ActivityChangeProject {
  name: string
  slug: string
  iconUrl: string
}

/** [projectId, observed - baseline, hasShortHistory] */
export type ActivityChangeContributor = [string, number, boolean]

export interface ActivityChangeEvent {
  timestamp: number
  category: ActivityChangeCategory
  metric: ActivityChangeMetric
  /** Daily counts; the category's baseline is the sum of project medians. */
  observed: number
  baseline: number
  score: number
  contributors: ActivityChangeContributor[]
  restDelta: number
  restCount: number
}

export interface ActivityChangeEventsData {
  projects: Record<string, ActivityChangeProject>
  events: ActivityChangeEvent[]
}

export function getActivityChangeEvents(
  filter: ActivityProjectFilter,
  range: ChartRange,
): Promise<ActivityChangeEventsData> {
  // Every day of every project gets a 28-day median, so MAX takes seconds.
  // Ranges end on the hour, but only fully synced days count, so keying by
  // day lets one result serve every hour.
  const dayRange: ChartRange = [
    range[0],
    UnixTime.toStartOf(UnixTime(range[1]), 'day'),
  ]
  return cache.get(
    {
      key: [
        'activity-change-events',
        filter.type,
        filter.type === 'projects'
          ? [...filter.projectIds].sort().join(',')
          : '',
        String(dayRange[0]),
        String(dayRange[1]),
      ],
      ttl: 10 * 60,
      staleWhileRevalidate: 60 * 60,
    },
    () => computeForFilter(filter, dayRange),
  )
}

async function computeForFilter(
  filter: ActivityProjectFilter,
  range: ChartRange,
): Promise<ActivityChangeEventsData> {
  if (env.MOCK) {
    return { projects: {}, events: [] }
  }

  const db = getDb()
  const projects = (await getActivityProjects()).filter(
    createActivityProjectsFilter(filter),
  )
  const categoryByProject = new Map<string, ActivityChangeCategory>()
  for (const project of projects) {
    const category = getCategory(project.scalingInfo.type)
    if (category) categoryByProject.set(project.id, category)
  }

  const [from, to] = await getFullySyncedActivityRange(range)
  const records = await db.activity.getByProjectsAndTimeRange(
    [...categoryByProject.keys()].map((id) => ProjectId(id)),
    [from === null ? null : from - BASELINE_DAYS * UnixTime.DAY, to],
  )

  const events = computeActivityChangeEvents(records, categoryByProject, from)

  const usedProjectIds = new Set(
    events.flatMap((e) => e.contributors.map(([projectId]) => projectId)),
  )
  const projectsInfo: Record<string, ActivityChangeProject> = {}
  for (const project of projects) {
    if (!usedProjectIds.has(project.id)) continue
    projectsInfo[project.id] = {
      name: project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    }
  }

  return { projects: projectsInfo, events }
}

function getCategory(
  type: string | undefined,
): ActivityChangeCategory | undefined {
  switch (type) {
    case 'ZK Rollup':
    case 'Optimistic Rollup':
      return 'rollups'
    case 'Validium':
    case 'Optimium':
      return 'validiumsAndOptimiums'
    case 'Other':
      return 'others'
  }
}

/**
 * Compares each project's day with the median of its previous 28 days, so a
 * category's change splits exactly into per-project contributions. Days with
 * no record for a project leave it out of both sides instead of counting zero.
 */
export function computeActivityChangeEvents(
  records: ActivityRecord[],
  categoryByProject: Map<string, ActivityChangeCategory>,
  visibleFrom: number | null,
): ActivityChangeEvent[] {
  const first = records[0]
  const last = records.at(-1)
  if (!first || !last) return []

  const valuesByProject = new Map<
    string,
    Map<number, Record<ActivityChangeMetric, number>>
  >()
  for (const record of records) {
    let values = valuesByProject.get(record.projectId)
    if (!values) {
      values = new Map()
      valuesByProject.set(record.projectId, values)
    }
    values.set(record.timestamp, {
      uops: record.uopsCount ?? record.count,
      tps: record.count,
    })
  }

  const timestamps = generateTimestamps(
    [UnixTime(first.timestamp), UnixTime(last.timestamp)],
    'day',
  )
  const candidates: ActivityChangeEvent[] = []

  for (const metric of ['uops', 'tps'] as const) {
    const categoryTotals = new Map<ActivityChangeCategory, number[]>(
      ACTIVITY_CHANGE_CATEGORIES.map((c) => [c, []]),
    )

    for (const timestamp of timestamps) {
      const perCategory = getCategoryDay(
        valuesByProject,
        categoryByProject,
        timestamp,
        metric,
      )
      const allL2Baseline = [...perCategory.values()].reduce(
        (sum, day) => sum + day.baseline,
        0,
      )
      const isVisible = visibleFrom === null || timestamp >= visibleFrom

      for (const [category, day] of perCategory) {
        const totals = categoryTotals.get(category) ?? []
        const robustZ = getRobustZ(day.observed, totals.slice(-BASELINE_DAYS))
        totals.push(day.observed)
        if (!isVisible || robustZ === undefined) continue

        const change = day.observed - day.baseline
        const isNotable =
          Math.abs(robustZ) >= MIN_ROBUST_Z &&
          Math.sign(robustZ) === Math.sign(change) &&
          Math.abs(change) >= MIN_RELATIVE_CHANGE * day.baseline &&
          Math.abs(change) >= MIN_ABSOLUTE_CHANGE &&
          Math.abs(change) >= MIN_SHARE_OF_ALL_L2 * allL2Baseline
        if (!isNotable) continue

        day.deltas.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        const rest = day.deltas.slice(MAX_CONTRIBUTORS)
        candidates.push({
          timestamp,
          category,
          metric,
          observed: day.observed,
          baseline: day.baseline,
          score: Math.abs(change) * Math.min(Math.abs(robustZ), MAX_RANKING_Z),
          contributors: day.deltas
            .slice(0, MAX_CONTRIBUTORS)
            .filter(([, delta]) => delta !== 0),
          restDelta: rest.reduce((sum, [, delta]) => sum + delta, 0),
          restCount: rest.filter(([, delta]) => delta !== 0).length,
        })
      }
    }
  }

  return keepEpisodePeaks(candidates)
}

function getCategoryDay(
  valuesByProject: Map<
    string,
    Map<number, Record<ActivityChangeMetric, number>>
  >,
  categoryByProject: Map<string, ActivityChangeCategory>,
  timestamp: number,
  metric: ActivityChangeMetric,
) {
  const perCategory = new Map<
    ActivityChangeCategory,
    { observed: number; baseline: number; deltas: ActivityChangeContributor[] }
  >()

  for (const [projectId, values] of valuesByProject) {
    const category = categoryByProject.get(projectId)
    const value = values.get(timestamp)?.[metric]
    if (!category || value === undefined) continue

    const history: number[] = []
    for (let i = 1; i <= BASELINE_DAYS; i++) {
      const past = values.get(timestamp - i * UnixTime.DAY)?.[metric]
      if (past !== undefined) history.push(past)
    }
    const baseline = history.length > 0 ? median(history) : 0

    let day = perCategory.get(category)
    if (!day) {
      day = { observed: 0, baseline: 0, deltas: [] }
      perCategory.set(category, day)
    }
    day.observed += value
    day.baseline += baseline
    day.deltas.push([
      projectId,
      value - baseline,
      history.length < MIN_BASELINE_OBSERVATIONS,
    ])
  }
  return perCategory
}

/**
 * Notable days in the same direction, at most a few days apart, are one
 * event: keep only the day with the largest change.
 */
function keepEpisodePeaks(
  candidates: ActivityChangeEvent[],
): ActivityChangeEvent[] {
  const result: ActivityChangeEvent[] = []
  const episodeByKey = new Map<
    string,
    { lastTimestamp: number; index: number }
  >()

  for (const event of [...candidates].sort(
    (a, b) => a.timestamp - b.timestamp,
  )) {
    const change = event.observed - event.baseline
    const key = `${event.metric}:${event.category}:${Math.sign(change)}`
    const episode = episodeByKey.get(key)

    if (episode && event.timestamp - episode.lastTimestamp <= MAX_EPISODE_GAP) {
      episode.lastTimestamp = event.timestamp
      const peak = result[episode.index]
      if (peak && Math.abs(change) > Math.abs(peak.observed - peak.baseline)) {
        result[episode.index] = event
      }
    } else {
      result.push(event)
      episodeByKey.set(key, {
        lastTimestamp: event.timestamp,
        index: result.length - 1,
      })
    }
  }
  return result
}

function getRobustZ(value: number, history: number[]): number | undefined {
  if (history.length < MIN_BASELINE_OBSERVATIONS) return undefined
  const center = median(history)
  const mad = median(history.map((h) => Math.abs(h - center)))
  // Flat histories have MAD = 0; fall back to a 1% band so z stays finite.
  const scale = Math.max(1.4826 * mad, 0.01 * center, 1)
  return (value - center) / scale
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
    : (sorted[mid] ?? 0)
}
