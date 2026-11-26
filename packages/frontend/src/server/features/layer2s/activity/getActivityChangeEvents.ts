import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import type { ChartRange } from '~/utils/range/range'
import {
  CHANGE_CATEGORIES,
  type ChangeCategory,
} from '../../utils/changeEventConstants'
import {
  type ChangeCandidate,
  type ChangeEventsData,
  type ChangeLevel,
  type ChangeStep,
  getBreakdown,
  getChangeProjects,
} from '../../utils/changeEvents'
import {
  findPeakRises,
  RISE_HISTORY_DAYS,
  type RiseLevel,
} from '../../utils/findPeakRises'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'
import { createActivityProjectsFilter } from './utils/projectFilterUtils'

export type ActivityChangeMetric = 'uops' | 'tps'
export type ActivityChangeCandidate = ChangeCandidate<ActivityChangeMetric>
export type ActivityChangeEventsData = ChangeEventsData<ActivityChangeMetric>

const cache = new FrontendInMemoryCache('getActivityChangeEvents')

export function getActivityChangeEvents(
  filter: ActivityProjectFilter,
  range: ChartRange,
): Promise<ActivityChangeEventsData> {
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
    return { projects: {}, candidates: [] }
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
    [from === null ? null : from - RISE_HISTORY_DAYS * UnixTime.DAY, to],
  )

  const candidates = computeActivityChangeCandidates(
    records,
    categoryByProject,
    from,
  )
  return { projects: getChangeProjects(projects, candidates), candidates }
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
 * Finds each category's rises in the visible days (from `visibleFrom`),
 * with how each splits across projects. A project's part is its value at
 * the peak minus its own mean over the days the category is compared with,
 * so the parts add up to the category's rise.
 */
export function computeActivityChangeCandidates(
  records: ActivityRecord[],
  categoryByProject: Map<string, ChangeCategory>,
  visibleFrom: number | null,
): ActivityChangeCandidate[] {
  const first = records[0]
  const last = records.at(-1)
  if (!first || !last) return []

  const timestamps = generateTimestamps(
    [UnixTime(first.timestamp), UnixTime(last.timestamp)],
    'day',
  )
  const indexByTimestamp = new Map(timestamps.map((t, i) => [t, i]))
  const visibleIndex = timestamps.findIndex(
    (t) => visibleFrom === null || t >= visibleFrom,
  )
  const start = visibleIndex === -1 ? timestamps.length : visibleIndex

  const candidates: ActivityChangeCandidate[] = []
  for (const metric of ['uops', 'tps'] as const) {
    // Per project, its value on each day; undefined where it has no record.
    const valuesByProject = new Map<string, (number | undefined)[]>()
    for (const record of records) {
      const index = indexByTimestamp.get(UnixTime(record.timestamp))
      if (index === undefined) continue
      let values = valuesByProject.get(record.projectId)
      if (!values) {
        values = new Array(timestamps.length)
        valuesByProject.set(record.projectId, values)
      }
      values[index] =
        metric === 'uops' ? (record.uopsCount ?? record.count) : record.count
    }

    for (const category of CHANGE_CATEGORIES) {
      const members = [...valuesByProject].filter(
        ([projectId]) => categoryByProject.get(projectId) === category,
      )
      // A day without any record is missing, not zero.
      const totals = timestamps.map((_, i) => {
        let sum: number | null = null
        for (const [, values] of members) {
          const value = values[i]
          if (value !== undefined) sum = (sum ?? 0) + value
        }
        return sum
      })

      for (const rise of findPeakRises(totals, start)) {
        const observed = totals[rise.peak] as number
        const levels: ChangeLevel[] = rise.levels.map((level) => ({
          onset: timestamps[level.onset] as number,
          baseline: level.baseline,
          ...getBreakdown(
            members.map(([projectId, values]) => [
              projectId,
              (values[rise.peak] ?? 0) - getMean(values, level),
            ]),
          ),
        }))
        candidates.push({
          category,
          metric,
          peak: timestamps[rise.peak] as number,
          observed,
          levels,
          steps: getSteps(rise.levels, members),
        })
      }
    }
  }
  return candidates
}

/**
 * Between each tighter level and each wider one that starts earlier, how
 * each project moved from the wider's usual highs to the tighter's.
 */
function getSteps(
  levels: RiseLevel[],
  members: [string, (number | undefined)[]][],
): ChangeStep[] {
  const steps: ChangeStep[] = []
  levels.forEach((tighter, to) => {
    levels.forEach((wider, from) => {
      if (from <= to || wider.baseline >= tighter.baseline) return
      steps.push({
        from,
        to,
        ...getBreakdown(
          members.map(([projectId, values]) => [
            projectId,
            getMean(values, tighter) - getMean(values, wider),
          ]),
        ),
      })
    })
  })
  return steps
}

/** A project's mean over a level's usual highs, counting no record as zero. */
function getMean(values: (number | undefined)[], level: RiseLevel) {
  return (
    level.highs.reduce((sum, i) => sum + (values[i] ?? 0), 0) /
    level.highs.length
  )
}
