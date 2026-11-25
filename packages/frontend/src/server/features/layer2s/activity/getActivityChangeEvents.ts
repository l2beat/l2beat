import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import type { ChartRange } from '~/utils/range/range'
import {
  BASELINE_DAYS,
  CHANGE_CATEGORIES,
  type ChangeCategory,
} from '../../utils/changeEventConstants'
import {
  type CategoryDay,
  type ChangeEvent,
  type ChangeEventsData,
  createChangeEvent,
  getChangeProjects,
  getRobustZ,
  MIN_HISTORY_DAYS,
  markEpisodePeaks,
  median,
} from '../../utils/changeEvents'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'
import { createActivityProjectsFilter } from './utils/projectFilterUtils'

export type ActivityChangeMetric = 'uops' | 'tps'
export type ActivityChangeEvent = ChangeEvent<ActivityChangeMetric>
export type ActivityChangeEventsData = ChangeEventsData<ActivityChangeMetric>

// A change is notable only when it clears every bar: unusual for the category
// (robust z), big for the category (relative), and big for the whole chart
// (absolute and share of all L2 activity), so small series don't fire on noise.
const MIN_ROBUST_Z = 4
const MIN_RELATIVE_CHANGE = 0.2
const MIN_ABSOLUTE_CHANGE = 5 * UnixTime.DAY
const MIN_SHARE_OF_ALL_L2 = 0.01

const cache = new FrontendInMemoryCache('getActivityChangeEvents')

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
  const categoryByProject = new Map<string, ChangeCategory>()
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
  return { projects: getChangeProjects(projects, events), events }
}

function getCategory(type: string | undefined): ChangeCategory | undefined {
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
  categoryByProject: Map<string, ChangeCategory>,
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
    const categoryTotals = new Map<ChangeCategory, number[]>(
      CHANGE_CATEGORIES.map((c) => [c, []]),
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

        candidates.push(
          createChangeEvent(timestamp, category, metric, day, robustZ),
        )
      }
    }
  }

  return markEpisodePeaks(candidates)
}

function getCategoryDay(
  valuesByProject: Map<
    string,
    Map<number, Record<ActivityChangeMetric, number>>
  >,
  categoryByProject: Map<string, ChangeCategory>,
  timestamp: number,
  metric: ActivityChangeMetric,
) {
  const perCategory = new Map<ChangeCategory, CategoryDay>()

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
      history.length < MIN_HISTORY_DAYS,
    ])
  }
  return perCategory
}
