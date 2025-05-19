import type { EntryParameters } from '@l2beat/discovery'
import { formatSeconds } from '@l2beat/shared-pure'

export function isMultisigLike(entry: EntryParameters | undefined): boolean {
  if (entry === undefined) {
    return false
  }

  const hasMembers = entry.values?.['$members'] !== undefined
  const hasThreshold = entry.values?.['$threshold'] !== undefined

  return hasMembers && hasThreshold
}

export function formatPermissionDescription(description: string): string {
  return description !== '' ? `- ${trimTrailingDots(description)}` : ''
}

export function trimTrailingDots(s: string): string {
  return s.replace(/\.*$/, '')
}

export function formatPermissionCondition(condition: string): string {
  return condition !== '' ? `${trimTrailingDots(condition)}` : ''
}

export function formatPermissionDelay(delay: number): string {
  return delay === 0 ? 'with no delay' : `with ${formatSeconds(delay)} delay`
}
