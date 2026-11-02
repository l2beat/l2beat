import type { TvsCoverageDismissalRecord } from '@l2beat/database'

export const DISMISSAL_REASONS = [
  'notRelevant',
  'spam',
  'doubleCounted',
  'other',
] as const
export type DismissalReason = (typeof DISMISSAL_REASONS)[number]

export interface Dismissal {
  projectId: string
  chain: string
  address: string
  reason: DismissalReason
  comment: string | undefined
  dismissedBy: string
  dismissedAt: number
}

export function toDismissal(record: TvsCoverageDismissalRecord): Dismissal {
  return {
    ...record,
    // The router only writes reasons from DISMISSAL_REASONS.
    reason: record.reason as DismissalReason,
  }
}
