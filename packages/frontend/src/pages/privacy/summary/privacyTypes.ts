import type { PrivacyField } from '@l2beat/config'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/** Columns a kind of privacy can leave out. */
export type PrivacySummaryOptionalColumn =
  | 'tvl'
  | 'trustedSetup'
  | 'anonymitySet'

/**
 * One group per kind of privacy a protocol promises, keyed by the field its
 * adversary assessment protects. Protocols are only ranked within a group:
 * hiding the link and hiding the amount are different promises, so one
 * ranking over both would compare unlike things.
 */
export const PRIVACY_TYPES = [
  {
    field: 'linkage',
    label: 'Link privacy',
    title: 'What is link privacy?',
    shortDescription:
      'Breaks the link between deposits and withdrawals; both stay public.',
    description:
      'Link privacy breaks the connection between where funds enter and where they leave. Deposits and withdrawals are still public, but an observer cannot tell which deposit paid for which withdrawal. The protection comes from the crowd: the more people use the same pool, the harder it is to match the two ends.',
  },
  {
    field: 'recipient',
    label: 'Recipient privacy',
    title: 'What is recipient privacy?',
    shortDescription:
      'Hides who is paid: each transfer lands at a fresh one-time address.',
    description:
      'Recipient privacy hides who is being paid. Each payment goes to a fresh one-time address that only the recipient can recognise as their own, so their main address and payment history stay out of view. The sender and the amount usually remain public.',
    // Stealth payments land straight in the recipient's one-time address;
    // nothing is locked in a contract, so there is no TVL to show. None of
    // these protocols has a ZK proving system, so every setup reads 'No setup'.
    hiddenColumns: ['tvl', 'trustedSetup'],
  },
  {
    field: 'amount',
    label: 'Amount privacy',
    title: 'What is amount privacy?',
    shortDescription:
      'Hides how much moves: balances and transfers are encrypted.',
    description:
      'Amount privacy hides how much is moved. Balances and transfer values are encrypted so only the parties involved can read them, while who pays whom stays public.',
    // None of these protocols has a ZK proving system, so every setup reads
    // 'No setup'. The anonymity set counts the crowd a deposit hides in, which
    // says nothing about how well an amount is hidden.
    hiddenColumns: ['trustedSetup', 'anonymitySet'],
  },
] as const satisfies {
  field: PrivacyField
  label: string
  title: string
  /** One line, for the grid where every card has to start on the same line. */
  shortDescription: string
  description: string
  hiddenColumns?: PrivacySummaryOptionalColumn[]
}[]

export interface PrivacyTypeGroup {
  field: PrivacyField
  label: string
  title: string
  shortDescription: string
  description: string
  hiddenColumns: PrivacySummaryOptionalColumn[]
  entries: PrivacySummaryEntry[]
}

export function groupByPrivacyType(
  entries: PrivacySummaryEntry[],
): PrivacyTypeGroup[] {
  return PRIVACY_TYPES.map((type) => ({
    ...type,
    hiddenColumns: 'hiddenColumns' in type ? [...type.hiddenColumns] : [],
    entries: entries.filter(
      (entry) => entry.adversaries.promise.protects === type.field,
    ),
  }))
}
