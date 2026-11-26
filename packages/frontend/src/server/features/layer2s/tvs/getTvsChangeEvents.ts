import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { ChartRange } from '~/utils/range/range'
import type { ChangeCategory } from '../../utils/changeEventConstants'
import {
  type ChangeCandidate,
  type ChangeContributor,
  type ChangeEventsData,
  getBreakdown,
  getChangeProjects,
  median,
} from '../../utils/changeEvents'
import { getTvsProjects } from './utils/getTvsProjects'
import { pinTvsRange } from './utils/pinTvsRange'
import {
  createTvsProjectsFilter,
  TvsProjectFilter,
} from './utils/projectFilterUtils'

export type TvsChangeCandidate = ChangeCandidate<'usd'>
export type TvsChangeEventsData = ChangeEventsData<'usd'>

export const TvsChangeEventsParams = v.object({
  range: ChartRange,
  filter: TvsProjectFilter,
  excludeRwaRestrictedTokens: v.boolean(),
})
export type TvsChangeEventsParams = v.infer<typeof TvsChangeEventsParams>

// TVS is a balance, so a change is a step: the value against a few days
// earlier. Prices move every project's TVS together, so a step counts only
// when at least this much of it is beyond the market's move.
const STEP_DAYS = 3
const MIN_SHARE_BEYOND_MARKET = 0.5
// Steps this small can't reach the chart's bar on any axis that shows the
// category, so they aren't sent.
const MIN_SHARE_OF_CATEGORY_MAX = 0.01

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
    return { projects: {}, candidates: [] }
  }

  const projects = await getTvsProjects(createTvsProjectsFilter(filter), {
    withoutArchived: true,
  })
  const categoryByProject = new Map<string, ChangeCategory>()
  for (const project of projects) {
    if (project.category)
      categoryByProject.set(project.projectId, project.category)
  }

  // A step at the range's start compares with days before it.
  const loadFrom = from === null ? null : from - STEP_DAYS * UnixTime.DAY
  const records = await getDb().tvsTokenValue.getSummedByProjectAtResolution(
    [...categoryByProject.keys()],
    [loadFrom === null ? null : UnixTime(loadFrom), UnixTime(to)],
    'day',
    // Matches the values the summary charts sum.
    { excludeRwaRestrictedTokens, forSummary: true },
  )

  const candidates = computeTvsChangeCandidates(
    records,
    categoryByProject,
    from,
  )
  return {
    projects: getChangeProjects(
      projects.map((p) => ({
        id: p.projectId,
        name: p.details.name,
        slug: p.details.slug,
      })),
      candidates,
    ),
    candidates,
  }
}

/**
 * Each category's steps over `STEP_DAYS` days in the visible range, per
 * project, so a step splits exactly into projects' changes. A project
 * missing either day is left out of both. Steps mostly made of the market's
 * move are dropped, and of overlapping steps the same way only the largest
 * stays.
 */
export function computeTvsChangeCandidates(
  records: { projectId: string; timestamp: number; value: number }[],
  categoryByProject: Map<string, ChangeCategory>,
  visibleFrom: number | null,
): TvsChangeCandidate[] {
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

  const steps: Step[] = []
  const categoryMax = new Map<ChangeCategory, number>()
  for (const timestamp of [...days].sort((a, b) => a - b)) {
    const start = timestamp - (STEP_DAYS - 1) * UnixTime.DAY
    if (visibleFrom !== null && start < visibleFrom) continue
    for (const step of getSteps(
      valuesByProject,
      categoryByProject,
      timestamp,
    )) {
      categoryMax.set(
        step.category,
        Math.max(categoryMax.get(step.category) ?? 0, step.observed),
      )
      const change = step.observed - step.baseline
      if (
        change !== 0 &&
        Math.sign(step.excess) === Math.sign(change) &&
        Math.abs(step.excess) >= MIN_SHARE_BEYOND_MARKET * Math.abs(change)
      ) {
        steps.push(step)
      }
    }
  }

  const byKey = new Map(steps.map((s) => [`${s.category}:${s.timestamp}`, s]))
  return steps
    .filter(
      (step) =>
        Math.abs(step.observed - step.baseline) >=
          MIN_SHARE_OF_CATEGORY_MAX * (categoryMax.get(step.category) ?? 0) &&
        isLargestOverlapping(step, byKey),
    )
    .map((step) => ({
      category: step.category,
      metric: 'usd',
      peak: step.timestamp,
      observed: step.observed,
      levels: [
        {
          onset: step.timestamp - (STEP_DAYS - 1) * UnixTime.DAY,
          baseline: step.baseline,
          ...getBreakdown(step.deltas),
        },
      ],
      steps: [],
    }))
}

interface Step {
  category: ChangeCategory
  timestamp: number
  observed: number
  baseline: number
  /** The change beyond what the market's move explains. */
  excess: number
  deltas: ChangeContributor[]
}

function getSteps(
  valuesByProject: Map<string, Map<number, number>>,
  categoryByProject: Map<string, ChangeCategory>,
  timestamp: number,
) {
  const pairs: {
    projectId: string
    category: ChangeCategory
    value: number
    previous: number
  }[] = []
  for (const [projectId, values] of valuesByProject) {
    const category = categoryByProject.get(projectId)
    const value = values.get(timestamp)
    const previous = values.get(timestamp - STEP_DAYS * UnixTime.DAY)
    if (!category || value === undefined || previous === undefined) continue
    pairs.push({ projectId, category, value, previous })
  }
  const marketMove = getMarketMove(pairs)

  const result = new Map<ChangeCategory, Step>()
  for (const { projectId, category, value, previous } of pairs) {
    let step = result.get(category)
    if (!step) {
      step = {
        category,
        timestamp,
        observed: 0,
        baseline: 0,
        excess: 0,
        deltas: [],
      }
      result.set(category, step)
    }
    step.observed += value
    step.baseline += previous
    step.excess += value - previous * (1 + marketMove)
    step.deltas.push([projectId, value - previous])
  }
  return result.values()
}

/** Overlapping steps the same way are one move; the largest stands for it. */
function isLargestOverlapping(step: Step, byKey: Map<string, Step>) {
  const change = step.observed - step.baseline
  for (let d = 1 - STEP_DAYS; d < STEP_DAYS; d++) {
    if (d === 0) continue
    const other = byKey.get(
      `${step.category}:${step.timestamp + d * UnixTime.DAY}`,
    )
    if (!other) continue
    const otherChange = other.observed - other.baseline
    if (Math.sign(otherChange) !== Math.sign(change)) continue
    // Ties go to the earlier step.
    if (
      Math.abs(otherChange) > Math.abs(change) ||
      (Math.abs(otherChange) === Math.abs(change) && d < 0)
    ) {
      return false
    }
  }
  return true
}

/**
 * The market's move over the step: the median project's relative change.
 * Not weighted by TVS, so the largest project's own jump isn't the market.
 */
function getMarketMove(pairs: { value: number; previous: number }[]) {
  const moves = pairs
    .filter((d) => d.previous > 0)
    .map((d) => d.value / d.previous - 1)
  return moves.length === 0 ? 0 : median(moves)
}
