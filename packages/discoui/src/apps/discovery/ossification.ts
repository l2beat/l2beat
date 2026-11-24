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

export function formatCriticalDate(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toISOString().slice(0, 10)
}
