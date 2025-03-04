import type { ContractParameters } from '@l2beat/discovery'
import { formatSeconds } from '@l2beat/shared-pure'

export function isMultisigLike(
  contract: ContractParameters | undefined,
): boolean {
  if (contract === undefined) {
    return false
  }

  const hasMembers = contract.values?.['$members'] !== undefined
  const hasThreshold = contract.values?.['$threshold'] !== undefined

  return hasMembers && hasThreshold
}

export function formatPermissionDescription(description: string): string {
  return description !== '' ? `- ${trimTrailingDots(description)}` : ''
}

export function trimTrailingDots(s: string): string {
  return s.replace(/\.*$/, '')
}

export function formatPermissionCondition(condition: string): string {
  return condition !== '' ? `if ${trimTrailingDots(condition)}` : ''
}

export function formatPermissionDelay(delay: number): string {
  return ` with ${formatSeconds(delay)} delay`
}
