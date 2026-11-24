import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { ChartRange } from '~/utils/range/range'
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
} from '../../utils/changeEvents'
import { getTvsProjects } from './utils/getTvsProjects'
import { pinTvsRange } from './utils/pinTvsRange'
import {
  createTvsProjectsFilter,
  TvsProjectFilter,
} from './utils/projectFilterUtils'

export type TvsChangeEvent = ChangeEvent<'usd'>
export type TvsChangeEventsData = ChangeEventsData<'usd'>

export const TvsChangeEventsParams = v.object({
  range: ChartRange,
  filter: TvsProjectFilter,
  excludeRwaRestrictedTokens: v.boolean(),
})
export type TvsChangeEventsParams = v.infer<typeof TvsChangeEventsParams>

// TVS is a balance, so a notable day is a jump: the day's change against the
// category's usual daily changes. It must also be big for the category and
// for all L2s, so a small category's noise doesn't fire.
const MIN_ROBUST_Z = 4
const MIN_RELATIVE_CHANGE = 0.03
const MIN_SHARE_OF_ALL_L2 = 0.005

const cache = new FrontendInMemoryCache('getTvsChangeEvents')

export function getTvsChangeEvents({
  range,
  filter,
  excludeRwaRestrictedTokens,
}: TvsChangeEventsParams): Promise<TvsChangeEventsData> {
  // Only whole days count, so keying by day lets one result serve every hour.
  const pinned = pinTvsRange(range)
  const dayRange: ChartRange = [
    pinned[0],
    UnixTime.toStartOf(UnixTime(pinned[1]), 'day'),
  ]
  return cache.get(
    {
      key: [
        'tvs-change-events',
        JSON.stringify(filter),
        String(excludeRwaRestrictedTokens),
        String(dayRange[0]),
        String(dayRange[1]),
      ],
      ttl: 10 * 60,
      staleWhileRevalidate: 60 * 60,
    },
    () => computeForFilter(filter, dayRange, excludeRwaRestrictedTokens),
  )
}

async function computeForFilter(
  filter: TvsProjectFilter,
  [from, to]: ChartRange,
  excludeRwaRestrictedTokens: boolean,
): Promise<TvsChangeEventsData> {
  if (env.MOCK) {
    return { projects: {}, events: [] }
  }

  const projects = await getTvsProjects(createTvsProjectsFilter(filter), {
    withoutArchived: true,
  })
  const categoryByProject = new Map<string, ChangeCategory>()
  for (const project of projects) {
    if (project.category)
      categoryByProject.set(project.projectId, project.category)
  }

  // A day's change needs the day before, and its z needs the days before that.
  const loadFrom =
    from === null ? null : from - (BASELINE_DAYS + 1) * UnixTime.DAY
  const records = await getDb().tvsTokenValue.getSummedByProjectAtResolution(
    [...categoryByProject.keys()],
    [loadFrom === null ? null : UnixTime(loadFrom), UnixTime(to)],
    'day',
    // Matches the values the summary charts sum.
    { excludeRwaRestrictedTokens, forSummary: true },
  )

  const events = computeTvsChangeEvents(records, categoryByProject, from)
  return {
    projects: getChangeProjects(
      projects.map((p) => ({
        id: p.projectId,
        name: p.details.name,
        slug: p.details.slug,
      })),
      events,
    ),
    events,
  }
}

/**
 * Compares each day's TVS with the day before, per project, so a category's
 * change splits exactly into per-project changes. A project missing either
 * day is left out of both.
 */
export function computeTvsChangeEvents(
  records: { projectId: string; timestamp: number; value: number }[],
  categoryByProject: Map<string, ChangeCategory>,
  visibleFrom: number | null,
): TvsChangeEvent[] {
  const valuesByProject = new Map<string, Map<number, number>>()
  const days = new Set<number>()
  for (const record of records) {
    // The query also returns the hours after the last whole day.
    if (record.timestamp % UnixTime.DAY !== 0) continue
    let values = valuesByProject.get(record.projectId)
    if (!values) {
      values = new Map()
      valuesByProject.set(record.projectId, values)
    }
    values.set(record.timestamp, record.value)
    days.add(record.timestamp)
  }

  const timestamps = [...days].sort((a, b) => a - b)
  const changesByCategory = new Map<ChangeCategory, number[]>(
    CHANGE_CATEGORIES.map((c) => [c, []]),
  )
  const candidates: TvsChangeEvent[] = []

  for (const timestamp of timestamps) {
    const perCategory = getCategoryDay(
      valuesByProject,
      categoryByProject,
      timestamp,
    )
    const allL2Baseline = [...perCategory.values()].reduce(
      (sum, day) => sum + day.baseline,
      0,
    )
    const isVisible = visibleFrom === null || timestamp >= visibleFrom

    for (const [category, day] of perCategory) {
      const changes = changesByCategory.get(category) ?? []
      const change = day.observed - day.baseline
      const robustZ = getRobustZ(change, changes.slice(-BASELINE_DAYS))
      changes.push(change)
      if (!isVisible || robustZ === undefined) continue

      const isNotable =
        Math.abs(robustZ) >= MIN_ROBUST_Z &&
        Math.sign(robustZ) === Math.sign(change) &&
        Math.abs(change) >= MIN_RELATIVE_CHANGE * day.baseline &&
        Math.abs(change) >= MIN_SHARE_OF_ALL_L2 * allL2Baseline
      if (!isNotable) continue

      candidates.push(
        createChangeEvent(timestamp, category, 'usd', day, robustZ),
      )
    }
  }

  return markEpisodePeaks(candidates)
}

function getCategoryDay(
  valuesByProject: Map<string, Map<number, number>>,
  categoryByProject: Map<string, ChangeCategory>,
  timestamp: number,
) {
  const perCategory = new Map<ChangeCategory, CategoryDay>()

  for (const [projectId, values] of valuesByProject) {
    const category = categoryByProject.get(projectId)
    const value = values.get(timestamp)
    const previous = values.get(timestamp - UnixTime.DAY)
    if (!category || value === undefined || previous === undefined) continue

    let history = 0
    for (let i = 1; i <= BASELINE_DAYS; i++) {
      if (values.has(timestamp - i * UnixTime.DAY)) history++
    }

    let day = perCategory.get(category)
    if (!day) {
      day = { observed: 0, baseline: 0, deltas: [] }
      perCategory.set(category, day)
    }
    day.observed += value
    day.baseline += previous
    day.deltas.push([projectId, value - previous, history < MIN_HISTORY_DAYS])
  }
  return perCategory
}
