import type { PrivacyField } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/** Ids of the summary table columns that only some groups show. */
export const PRIVACY_SUMMARY_OPTIONAL_COLUMNS = {
  tvl: 'totalValueLockedUsd',
  volume30d: 'totalValueDeposited30dUsd',
  anonymitySet: 'anonymitySet',
  trustedSetup: 'trustedSetup',
} as const

export type PrivacySummaryOptionalColumn =
  (typeof PRIVACY_SUMMARY_OPTIONAL_COLUMNS)[keyof typeof PRIVACY_SUMMARY_OPTIONAL_COLUMNS]

interface PrivacySummaryGroupConfig {
  field: PrivacyField
  label: string
  description: string
  hiddenColumns: PrivacySummaryOptionalColumn[]
}

export interface PrivacySummaryGroup extends PrivacySummaryGroupConfig {
  entries: PrivacySummaryEntry[]
}

const COLUMNS = PRIVACY_SUMMARY_OPTIONAL_COLUMNS

/**
 * Hiding the link, the recipient or the amount are different promises, so
 * protocols are only ranked against those making the same one. Each table
 * shows one headline number: TVL where funds stay in the protocol, the 30-day
 * volume where they only pass through.
 */
const GROUPS: PrivacySummaryGroupConfig[] = [
  {
    field: 'linkage',
    label: 'Link privacy',
    description:
      'Hides which deposit became which withdrawal. Both stay public.',
    hiddenColumns: [COLUMNS.volume30d],
  },
  {
    field: 'recipient',
    label: 'Recipient privacy',
    description:
      'Hides who is paid. Each payment lands at a fresh one-time address.',
    // Stealth payments lock nothing in a contract and need no ZK proofs.
    hiddenColumns: [COLUMNS.tvl, COLUMNS.trustedSetup],
  },
  {
    field: 'amount',
    label: 'Amount privacy',
    description: 'Hides how much moves. Balances and transfers are encrypted.',
    // No ZK proofs, and the crowd a deposit hides in says nothing about how
    // well its amount is hidden.
    hiddenColumns: [
      COLUMNS.volume30d,
      COLUMNS.trustedSetup,
      COLUMNS.anonymitySet,
    ],
  },
]

/** Keeps the entries' order, so each group stays ranked by privacy. */
export function getPrivacySummaryGroups(
  entries: PrivacySummaryEntry[],
): PrivacySummaryGroup[] {
  const byField = groupBy(
    entries,
    (entry) => entry.adversaries.promise.protects,
  )
  const unsupported = Object.keys(byField).filter(
    (field) => !GROUPS.some((group) => group.field === field),
  )
  assert(
    unsupported.length === 0,
    `No privacy summary table for protocols protecting ${unsupported.join(', ')}`,
  )

  return GROUPS.flatMap((group) => {
    const groupEntries = byField[group.field]
    if (!groupEntries) {
      return []
    }
    return { ...group, entries: groupEntries }
  })
}
