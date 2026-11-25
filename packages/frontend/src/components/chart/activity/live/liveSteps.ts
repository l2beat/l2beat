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
  /** Where the next one starts, as the window's and the whole buffer's can differ in width */
  end: number
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
      end: start + bucket,
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
 * Where the whole buffer's buckets hand over to the window's: where the
 * window's read starts. None when the two differ in width, as bars of two
 * sizes are not drawn together, or when the buffer starts no earlier than the
 * window's read, or ends before it
 */
export function getSeam(
  window: ProjectLiveWindow['window'],
  whole: ProjectLiveWindow['window'],
): number | undefined {
  const joins =
    whole.bucket === window.bucket &&
    whole.readFrom < window.readFrom &&
    whole.to >= window.readFrom
  return joins ? window.readFrom : undefined
}

/**
 * The whole buffer's buckets up to `seam` and the window's from it: what a
 * window moved through the buffer is drawn from
 */
export function withWhole(
  buckets: LiveBucket[],
  whole: LiveBucket[],
  seam: number,
) {
  return [
    ...whole.filter((b) => b.end <= seam),
    ...buckets.filter((b) => b.start >= seam),
  ]
}

/** The hours read with the window, and the whole buffer's others */
export function withWholeUsual(usual: UsualHour[], whole: UsualHour[]) {
  const hours = new Set(usual.map((u) => u.hour))
  return [...usual, ...whole.filter((u) => !hours.has(u.hour))]
}

/**
 * A row at the start of each bucket the window is in, for a curve that holds
 * a row's value up to the next one. The buckets on its edges are whole, as
 * the chart clips them
 */
export function toSteps(buckets: LiveBucket[], [from, to]: [number, number]) {
  return buckets
    .filter(({ start, end }) => end > from && start < to)
    .map(({ start, end, value, ratio, blocks }) => ({
      timestamp: start,
      end,
      value,
      ratio,
      blocks,
    }))
}

const DRAWN = ['value', 'ratio', 'usualMin', 'usualMedian', 'usualMax'] as const

/**
 * A step is drawn only up to a next row with a value, so one before a row
 * without, or the last, would not be. Each gets a row closing it where it
 * ends: at the end, the last row again where its bucket ends, and before a
 * row without a value, that row with the value the step had
 */
export function closeSteps<
  T extends { timestamp: number; end: number } & Record<
    (typeof DRAWN)[number],
    number | null
  >,
>(steps: T[]): T[] {
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
  return [...closed, { ...last, timestamp: last.end }]
}

/**
 * The buckets wholly in the window, but none before the oldest stored block,
 * in total and per second: what the figures under the charts show
 */
export function getWindowStats(
  buckets: LiveBucket[],
  [from, to]: [number, number],
) {
  const inWindow = buckets.filter(
    (b) => b.value !== null && b.start >= from && b.end <= to,
  )
  const first = inWindow[0]
  const last = inWindow.at(-1)
  if (!first || !last) return undefined
  const sum = (get: (b: LiveBucket) => number) =>
    inWindow.reduce((total, b) => total + get(b), 0)
  const seconds = sum((b) => b.end - b.start)
  const blocks = sum((b) => b.blocks)
  const gas = sum((b) => b.gas)
  return {
    /** Where the buckets the figures come from start and end */
    from: first.start,
    to: last.end,
    rate: sum((b) => (b.value ?? 0) * (b.end - b.start)) / seconds,
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
  // before the first step too, which can start before the window
  const start = Math.min(from, steps[0]?.timestamp ?? from)
  const hour = Math.floor((start - 1) / UnixTime.HOUR) * UnixTime.HOUR
  return [
    { timestamp: hour, end: hour, value: null, ratio: null, blocks: 0 },
    ...steps,
  ]
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
