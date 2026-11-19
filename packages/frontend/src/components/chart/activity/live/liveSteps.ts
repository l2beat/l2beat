import type { LiveActivityBucketRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ProjectLiveWindow } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import type {
  UsualHour,
  UsualRange,
} from '~/server/features/layer2s/activity/live/liveWindow'
import { getUopsRatio } from '../utils/getRatioChartData'
import { hasHistory, LIVE_METRICS, type LiveMetric } from './liveMetrics'

export interface LiveBucket {
  start: number
  /** Per second, of the metric picked. Null before the oldest stored block */
  value: number | null
  ratio: number | null
  blocks: number
  gas: number
}

/**
 * Every bucket read, so gaps between blocks show, but none before the oldest
 * stored block
 */
export function toBuckets(
  { readFrom, to, bucket }: ProjectLiveWindow['window'],
  records: LiveActivityBucketRecord[],
  metric: LiveMetric,
  oldest: number | undefined,
) {
  const byTime = new Map<number, LiveActivityBucketRecord>(
    records.map((r) => [r.timestamp, r]),
  )
  const buckets: LiveBucket[] = []
  for (let start: number = readFrom; start < to; start += bucket) {
    const record = byTime.get(start)
    buckets.push({
      start,
      ratio: record ? getUopsRatio(record.uopsCount, record.count) : null,
      value:
        !record && (oldest === undefined || start < oldest)
          ? null
          : (record ? LIVE_METRICS[metric].count(record) : 0) / bucket,
      blocks: record?.blocks ?? 0,
      gas: record?.gasUsed ?? 0,
    })
  }
  return buckets
}

/**
 * A row at the start of each bucket the window is in, for a curve that holds
 * a row's value up to the next one. The buckets on its edges are whole, as
 * the chart clips them
 */
export function toSteps(
  buckets: LiveBucket[],
  bucket: number,
  [from, to]: [number, number],
) {
  return buckets
    .filter(({ start }) => start + bucket > from && start < to)
    .map(({ start, value, ratio, blocks }) => ({
      timestamp: start,
      value,
      ratio,
      blocks,
    }))
}

const DRAWN = ['value', 'ratio', 'usualMin', 'usualMedian', 'usualMax'] as const

/**
 * A step is drawn only up to a next row with a value, so one before a row
 * without, or the last, would not be. Each gets a row closing it where it
 * ends: at the end, the last row again a bucket later, and before a row
 * without a value, that row with the value the step had
 */
export function closeSteps<
  T extends { timestamp: number } & Record<
    (typeof DRAWN)[number],
    number | null
  >,
>(steps: T[], bucket: number): T[] {
  const last = steps.at(-1)
  if (!last) return steps
  const closed = steps.flatMap((step, i) => {
    const previous = steps[i - 1]
    const ending = DRAWN.filter(
      (key) => previous && previous[key] !== null && step[key] === null,
    )
    if (!previous || ending.length === 0) return [step]
    const closing = { ...step }
    for (const key of ending) closing[key] = previous[key]
    return [closing, step]
  })
  return [...closed, { ...last, timestamp: last.timestamp + bucket }]
}

/**
 * The buckets wholly in the window, but none before the oldest stored block,
 * in total and per second: what the figures under the charts show
 */
export function getWindowStats(
  buckets: LiveBucket[],
  bucket: number,
  [from, to]: [number, number],
) {
  const inWindow = buckets.filter(
    (b) => b.value !== null && b.start >= from && b.start + bucket <= to,
  )
  const first = inWindow[0]
  const last = inWindow.at(-1)
  if (!first || !last) return undefined
  const seconds = inWindow.length * bucket
  const sum = (get: (b: LiveBucket) => number) =>
    inWindow.reduce((total, b) => total + get(b), 0)
  const blocks = sum((b) => b.blocks)
  const gas = sum((b) => b.gas)
  return {
    /** Where the buckets the figures come from start and end */
    from: first.start,
    to: last.start + bucket,
    rate: sum((b) => b.value ?? 0) / inWindow.length,
    blocks,
    gas,
    blocksPerMinute: (blocks / seconds) * 60,
    gasPerSecond: gas / seconds,
  }
}

/**
 * An empty step at the start of the hour before the window: a dashed line
 * drawn from there keeps its dashes in place as the window moves, rather than
 * starting them anew at its edge with every drawing
 */
export function withDashAnchor(
  steps: ReturnType<typeof toSteps>,
  from: number,
) {
  const hour = Math.floor((from - 1) / UnixTime.HOUR) * UnixTime.HOUR
  return [{ timestamp: hour, value: null, ratio: null, blocks: 0 }, ...steps]
}

/** Each step with the usual range of the hour it is in, null without one, as for gas */
export function withUsual<T extends { timestamp: number }>(
  steps: T[],
  usual: UsualHour[],
  metric: LiveMetric,
) {
  const byHour = new Map<number, UsualRange>(
    hasHistory(metric) ? usual.map((u) => [u.hour, u[metric]]) : [],
  )
  return steps.map((step) => {
    const range = byHour.get(
      Math.floor(step.timestamp / UnixTime.HOUR) * UnixTime.HOUR,
    )
    return {
      ...step,
      usualMin: range?.min ?? null,
      usualMedian: range?.median ?? null,
      usualMax: range?.max ?? null,
    }
  })
}

/**
 * The usual rate over the window: each hour's median, by how much of the
 * window it covers. None unless the past days have every hour of it
 */
export function getUsualRate(
  usual: UsualHour[],
  metric: ActivityMetric,
  [from, to]: [number, number],
) {
  let total = 0
  let covered = 0
  for (const u of usual) {
    const seconds =
      Math.min(to, u.hour + UnixTime.HOUR) - Math.max(from, u.hour)
    if (seconds <= 0) continue
    total += u[metric].median * seconds
    covered += seconds
  }
  // a rate measured over more than the usual hours cover compares with
  // nothing
  return covered > 0 && covered >= to - from ? total / covered : undefined
}

/** A row of the main chart, as its tooltip gets it */
export type LiveRow = ReturnType<
  typeof withUsual<ReturnType<typeof toSteps>[number]>
>[number]

/** The value drawn at `timestamp`: of the last step starting at or before it */
export function valueAt(
  steps: { timestamp: number; value: number | null }[],
  timestamp: number,
) {
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i]
    if (step && step.timestamp <= timestamp) return step.value
  }
  return null
}
