import type { PrivacyField } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/** Ids of the summary table columns that only some groups show. */
export type PrivacySummaryOptionalColumn =
  | 'totalValueLockedUsd'
  | 'totalValueDeposited30dUsd'
  | 'anonymitySet'
  | 'trustedSetup'

interface PrivacySummaryGroupConfig {
  field: PrivacyField
  description: string
  hiddenColumns: PrivacySummaryOptionalColumn[]
}

export interface PrivacySummaryGroup extends PrivacySummaryGroupConfig {
  label: string
  entries: PrivacySummaryEntry[]
}

/**
 * Hiding the link, the recipient or the amount are different promises, so
 * protocols are only ranked against those making the same one. Each table
 * shows one headline number: TVL where funds stay in the protocol, the 30-day
 * volume where they only pass through.
 */
const GROUPS: PrivacySummaryGroupConfig[] = [
  {
    field: 'linkage',
    description:
      'Breaks the link between deposits and withdrawals; both stay public.',
    hiddenColumns: ['totalValueDeposited30dUsd'],
  },
  {
    field: 'recipient',
    description:
      'Hides who is paid: each transfer lands at a fresh one-time address.',
    // Stealth payments lock nothing in a contract and need no ZK proofs.
    hiddenColumns: ['totalValueLockedUsd', 'trustedSetup'],
  },
  {
    field: 'amount',
    description: 'Hides how much moves: balances and transfers are encrypted.',
    // No ZK proofs, and the crowd a deposit hides in says nothing about how
    // well its amount is hidden.
    hiddenColumns: [
      'totalValueDeposited30dUsd',
      'trustedSetup',
      'anonymitySet',
    ],
  },
]

export function getPrivacySummaryGroups(
  entries: PrivacySummaryEntry[],
): PrivacySummaryGroup[] {
  for (const entry of entries) {
    const { protects } = entry.adversaries.promise
    assert(
      GROUPS.some((group) => group.field === protects),
      `No privacy summary table for protocols protecting ${protects}`,
    )
  }

  return GROUPS.flatMap((group) => {
    const groupEntries = entries.filter(
      (entry) => entry.adversaries.promise.protects === group.field,
    )
    const first = groupEntries[0]
    if (!first) {
      return []
    }
    return {
      ...group,
      label: first.adversaries.promiseLabel,
      entries: groupEntries,
    }
  })
}
