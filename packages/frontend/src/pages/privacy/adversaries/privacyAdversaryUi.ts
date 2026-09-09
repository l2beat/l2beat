import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyFieldExposure,
  PrivacyExposure,
} from '@l2beat/config'

export const PRIVACY_ADVERSARIES_TOOLTIP =
  'Can a careful user defeat this adversary using only the protocol and the supported options of its client? Green: yes. Yellow: only outside supported options, or by accepting a leak to another adversary. Red: no. Hover a cell for the condition and details.'

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

export const PRIVACY_EXPOSURE_CLASS_NAME: Record<
  PrivacyExposure,
  string
> = {
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

export function getExposureNote(leak: PrivacyFieldExposure): string | undefined {
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
