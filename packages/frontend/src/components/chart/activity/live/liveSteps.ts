import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ProjectLiveActivity } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'

/** Gas has no history, so only the live view has it */
export type LiveMetric = ActivityMetric | 'gas'

/** Where each metric's count is in a point */
export const METRIC_INDEX = { tps: 1, uops: 2, gas: 4 } as const

/** Seconds between a step's end and the next one's start */
const STEP_GAP = 0.001

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
  detail: ProjectLiveActivity['detail'],
  metric: LiveMetric,
  oldest: number | undefined,
) {
  const { readFrom, to, bucket, points } = detail
  const byTime = new Map(points.map((p) => [p[0], p]))
  const buckets: LiveBucket[] = []
  for (let start = readFrom; start <= to; start += bucket) {
    const point = byTime.get(start)
    const count = point ? point[METRIC_INDEX[metric]] : 0
    buckets.push({
      start,
      ratio: point ? (point[1] === 0 ? 1 : point[2] / point[1]) : null,
      value:
        !point && (oldest === undefined || start < oldest)
          ? null
          : count / bucket,
      blocks: point?.[3] ?? 0,
      gas: point?.[4] ?? 0,
    })
  }
  return buckets
}

/**
 * Each bucket in the window as a flat step from its start to its end, the
 * ones on its edges cut there, as the chart does not clip. A step ends a
 * hair before the next starts, so the row nearest the pointer is always one
 * of the bucket under it
 */
export function toSteps(
  buckets: LiveBucket[],
  bucket: number,
  [from, to]: [number, number],
) {
  return buckets.flatMap(({ start, value, ratio, blocks }) => {
    const end = start + bucket
    if (end <= from || start >= to) return []
    return [
      { timestamp: Math.max(start, from), value, ratio, blocks },
      { timestamp: Math.min(end, to) - STEP_GAP, value, ratio, blocks },
    ]
  })
}

/**
 * Per second, over the buckets wholly in the window, but none before the
 * oldest stored block: what the figures under the charts show
 */
export function getWindowStats(
  buckets: LiveBucket[],
  bucket: number,
  [from, to]: [number, number],
) {
  const inWindow = buckets.filter(
    (b) => b.value !== null && b.start >= from && b.start + bucket <= to,
  )
  if (inWindow.length === 0) return undefined
  const seconds = inWindow.length * bucket
  const sum = (get: (b: LiveBucket) => number) =>
    inWindow.reduce((total, b) => total + get(b), 0)
  return {
    rate: sum((b) => b.value ?? 0) / inWindow.length,
    blocksPerMinute: (sum((b) => b.blocks) / seconds) * 60,
    gasPerSecond: sum((b) => b.gas) / seconds,
  }
}
