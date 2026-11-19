import { formatNumber } from '@l2beat/shared-pure'
import { formatRange, parseTimestamp } from '~/utils/dates'

/**
 * Where a window of `seconds` asked to end at `end` does: within the buffer,
 * and undefined, so following the newest block, once close to it
 */
export function clampTo(
  end: number | undefined,
  buffer: { from: number; to: number } | undefined,
  seconds: number,
) {
  if (end === undefined || buffer === undefined) return undefined
  const clamped = Math.max(buffer.from + seconds, end)
  return clamped >= buffer.to - seconds / 20 ? undefined : clamped
}

/** Every multiple of `step` from `from` to `to` */
export function ticksOf(from: number, to: number, step: number) {
  const ticks: number[] = []
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t)
  return ticks
}

/** Buckets are counted from the epoch, so any time in one gives its start */
export function formatBucket(timestamp: number, bucket: number) {
  const start = Math.floor(timestamp / bucket) * bucket
  return formatRange(start, start + bucket, { seconds: true })
}

export function formatTick(timestamp: number) {
  return parseTimestamp(timestamp).time
}

export const formatGas = (value: number) => formatNumber(value, 1)
