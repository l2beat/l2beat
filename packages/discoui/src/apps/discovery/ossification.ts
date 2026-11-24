import type { ApiCriticalFlag } from '../../api/types'

export type CriticalStatus = 'critical' | 'scheduled' | 'retired' | 'none'

export function getCriticalStatus(
  critical: ApiCriticalFlag | undefined,
  nowSeconds = Math.floor(Date.now() / 1000),
): CriticalStatus {
  if (critical === undefined) {
    return 'none'
  }
  if (critical === true) {
    return 'critical'
  }
  if (
    critical.untilTimestamp !== undefined &&
    nowSeconds > critical.untilTimestamp
  ) {
    return 'retired'
  }
  if (
    critical.sinceTimestamp !== undefined &&
    nowSeconds < critical.sinceTimestamp
  ) {
    return 'scheduled'
  }
  return 'critical'
}

export function isOssificationCritical(
  critical: ApiCriticalFlag | undefined,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  return getCriticalStatus(critical, nowSeconds) === 'critical'
}

export const MAX_CRITICAL_TIMEOUT_MS = 2_147_483_647

export function getNextCriticalTransitionDelayMs(
  flags: Iterable<ApiCriticalFlag | undefined>,
  nowMs = Date.now(),
): number | undefined {
  let earliestMs: number | undefined
  for (const flag of flags) {
    if (flag === undefined || flag === true) continue
    if (flag.sinceTimestamp !== undefined) {
      const atMs = flag.sinceTimestamp * 1000
      if (atMs > nowMs && (earliestMs === undefined || atMs < earliestMs)) {
        earliestMs = atMs
      }
    }
    if (flag.untilTimestamp !== undefined) {
      // Active while nowSeconds <= untilTimestamp; retires at untilTimestamp + 1s.
      const atMs = (flag.untilTimestamp + 1) * 1000
      if (atMs > nowMs && (earliestMs === undefined || atMs < earliestMs)) {
        earliestMs = atMs
      }
    }
  }
  if (earliestMs === undefined) {
    return undefined
  }
  return Math.min(earliestMs - nowMs, MAX_CRITICAL_TIMEOUT_MS)
}

export function formatCriticalDate(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toISOString().slice(0, 10)
}
