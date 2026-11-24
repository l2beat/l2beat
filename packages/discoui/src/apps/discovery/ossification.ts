import type { ApiCriticalFlag } from '../../api/types'

export type CriticalStatus = 'critical' | 'retired' | 'none'

export function getCriticalStatus(
  critical: ApiCriticalFlag | undefined,
): CriticalStatus {
  if (critical === undefined) {
    return 'none'
  }
  if (critical === true || critical.untilTimestamp === undefined) {
    return 'critical'
  }
  return 'retired'
}

export function isOssificationCritical(
  critical: ApiCriticalFlag | undefined,
): boolean {
  return getCriticalStatus(critical) === 'critical'
}

export function formatCriticalDate(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toISOString().slice(0, 10)
}
