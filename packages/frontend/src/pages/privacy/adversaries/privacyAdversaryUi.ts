import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyExposure,
  PrivacyFieldExposure,
} from '@l2beat/config'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'

export const PRIVACY_ADVERSARIES_TOOLTIP =
  'The shape is what the protocol protects: a chain link for the deposit-to-withdrawal link, a person with an incoming arrow for the recipient, coins for amounts. The colour says whether a careful user can keep it private against this adversary using the protocol and its supported client options: green yes, yellow only outside supported options or by accepting another leak, red no. A plus below the shape means the adversary learns more than a public observer, such as who you are; hover a cell for what exactly.'

/** Spine order; must match the order of PrivacyAdversariesSummary.cells. */
export const PRIVACY_ADVERSARY_IDS: PrivacyAdversaryId[] = [
  'publicObserver',
  'chainAnalyst',
  'networkObserver',
  'privilegedInsider',
  'futureAdversary',
]

export const PRIVACY_ADVERSARY_TOOLTIP: Record<PrivacyAdversaryId, string> = {
  publicObserver:
    'Anyone with a block explorer, today. Sees every transaction and event but does no correlation beyond following links.',
  chainAnalyst:
    'Keeps a copy of the whole chain forever and correlates it: timing, amounts, wallet fingerprints, address clusters, exchange KYC data. Chain analytics firms, tax authorities, data brokers.',
  networkObserver:
    'Sits between the user and the chain: RPC providers, relayers, indexers, wallet backends, ISPs. Learns IP addresses, query patterns and pre-broadcast transactions.',
  privilegedInsider:
    'Holds a protocol role: upgrade admin, sequencer, view or decryption key holder, TEE vendor, association set provider. Can see more than the public, or exclude users.',
  futureAdversary:
    'Harvest now, decrypt later. Holds every byte ever written onchain plus future cryptanalysis such as a quantum computer that breaks elliptic-curve key exchange, but not hashes or lattices.',
}

/** Short column headers for the summary table. */
export const PRIVACY_ADVERSARY_SHORT_LABEL: Record<PrivacyAdversaryId, string> =
  {
    publicObserver: 'Public',
    chainAnalyst: 'Analyst',
    networkObserver: 'Network',
    privilegedInsider: 'Insider',
    futureAdversary: 'Future',
  }

export const PRIVACY_EXPOSURE_LABEL: Record<PrivacyExposure, string> = {
  private: 'private',
  atRisk: 'at risk',
  exposed: 'exposed',
  unverifiable: 'unverifiable',
}

export const PRIVACY_EXPOSURE_CLASS_NAME: Record<PrivacyExposure, string> = {
  private: 'text-[#17452A] bg-[#C8F2D7] border-[#4FB875]',
  atRisk: 'text-[#5C3B00] bg-[#FFE8A3] border-[#D9A31A]',
  exposed: 'text-[#5D1111] bg-[#FFC9C9] border-[#E06565]',
  unverifiable: 'text-[#3A3F4B] bg-[#E3E6EC] border-[#9AA1AE]',
}

export const PRIVACY_SEGMENT_LABEL = {
  boundary: 'In and out',
  interior: 'Inside',
} as const

export function getExposure(leak: PrivacyFieldExposure): PrivacyExposure {
  return typeof leak === 'string' ? leak : leak.verdict
}

export function getExposureNote(
  leak: PrivacyFieldExposure,
): string | undefined {
  return typeof leak === 'string' ? undefined : leak.note
}

export function sentimentToState(sentiment: PrivacyAdversarySentiment) {
  switch (sentiment) {
    case 'good':
      return 'private'
    case 'warning':
      return 'at risk'
    case 'bad':
      return 'exposed'
  }
}

/** Anchor of an adversary block inside the project page section. */
export function getPrivacyAdversaryAnchor(id: PrivacyAdversaryId): string {
  return `privacy-adversaries-${id}`
}

const SEVERITY: Record<PrivacyExposure, number> = {
  private: 0,
  unverifiable: 1,
  atRisk: 2,
  exposed: 3,
}

/** Worst leak beyond the public observer, identity included. */
export function worstExtraLeak(
  cell: PrivacyAdversarySummaryCell,
): PrivacyExposure | undefined {
  const all = [cell.identity, ...cell.alsoExposed.map((f) => f.exposure)]
  const worst = all.reduce((a, b) => (SEVERITY[b] > SEVERITY[a] ? b : a))
  return worst === 'private' ? undefined : worst
}
