import type { PrivacyField } from '@l2beat/config'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/**
 * Alternative layouts of the summary, picked with the switch at the top of the
 * page and kept in `?view=` so a layout can be linked to while they are being
 * compared.
 */
export const PRIVACY_SUMMARY_VIEWS = [
  {
    id: 'grid',
    label: 'V1 · Grid',
    description:
      'One compact table per kind of privacy, side by side, each with a single rosette over the privacy and protocol risks.',
  },
  {
    id: 'rosette',
    label: 'V2 · Rosette',
    description:
      'A tab per kind of privacy and a single rosette: adversaries on the left half, protocol risks on the right.',
  },
  {
    id: 'split',
    label: 'V3 · Split',
    description:
      'A tab per kind of privacy, a rosette for the adversaries alone, and the protocol risks in columns of their own.',
  },
  {
    id: 'cards',
    label: 'V4 · Cards',
    description:
      'A card per protocol with its rosette, the verdict in words, key numbers and attributes.',
  },
] as const

export type PrivacySummaryView = (typeof PRIVACY_SUMMARY_VIEWS)[number]['id']

export const DEFAULT_PRIVACY_SUMMARY_VIEW: PrivacySummaryView = 'grid'

export function toPrivacySummaryView(value: string): PrivacySummaryView {
  return (
    PRIVACY_SUMMARY_VIEWS.find((view) => view.id === value)?.id ??
    DEFAULT_PRIVACY_SUMMARY_VIEW
  )
}

/** Columns a kind of privacy can leave out. */
export type PrivacySummaryOptionalColumn = 'tvl'

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
    description:
      'Link privacy breaks the connection between where funds enter and where they leave. Deposits and withdrawals are still public, but an observer cannot tell which deposit paid for which withdrawal. The protection comes from the crowd: the more people use the same pool, the harder it is to match the two ends.',
  },
  {
    field: 'recipient',
    label: 'Recipient privacy',
    title: 'What is recipient privacy?',
    description:
      'Recipient privacy hides who is being paid. Each payment goes to a fresh one-time address that only the recipient can recognise as their own, so their main address and payment history stay out of view. The sender and the amount usually remain public.',
    // Stealth payments land straight in the recipient's one-time address;
    // nothing is locked in a contract, so there is no TVL to show.
    hiddenColumns: ['tvl'],
  },
  {
    field: 'amount',
    label: 'Amount privacy',
    title: 'What is amount privacy?',
    description:
      'Amount privacy hides how much is moved. Balances and transfer values are encrypted so only the parties involved can read them, while who pays whom stays public.',
  },
] as const satisfies {
  field: PrivacyField
  label: string
  title: string
  description: string
  hiddenColumns?: PrivacySummaryOptionalColumn[]
}[]

export interface PrivacyTypeGroup {
  field: PrivacyField
  label: string
  title: string
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
