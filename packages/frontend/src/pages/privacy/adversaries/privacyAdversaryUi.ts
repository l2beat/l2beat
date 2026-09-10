import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyExposure,
  PrivacyFieldExposure,
} from '@l2beat/config'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'

export const PRIVACY_ADVERSARIES_TOOLTIP =
  'Ethereum is public: every address keeps its past and its future in the open, and a privacy protocol can at best cut the link between them, hide who receives, or hide how much. The shape is what the protocol protects: a chain link for the deposit-to-withdrawal link, a person with an incoming arrow for the recipient, coins for amounts. The colour says whether a careful user can keep it private against this adversary using the protocol and its supported client options: green yes, yellow only outside supported options or by accepting another leak, red no. A plus next to the shape means the adversary learns more than a public observer; hover a cell for what exactly.'

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
    'Anyone with a block explorer, today. Sees every transaction, event and storage slot, but does no correlation beyond following links.',
  chainAnalyst:
    'Keeps a copy of the whole chain forever and correlates it: timing, amounts, gas and wallet fingerprints, address clusters, and offchain data such as exchange KYC. Cannot coerce anyone.',
  networkObserver:
    'Sits between the user and the chain and sees traffic only: RPC providers, relayers and broadcasters, indexers, ISPs. Learns IP addresses, timing, ciphertext and what becomes public. Assumes Tor and, where the client has an RPC setting, an own node.',
  privilegedInsider:
    'Holds a protocol role or receives keys or plaintext by design: upgrade admin, sequencer, decryption or view key holder, TEE vendor, association set provider, hosted prover, note registry, any service the operator runs. Can SEE more than the public, or EXCLUDE users, which also partitions anonymity sets.',
  futureAdversary:
    'Harvest now, decrypt later. Holds every byte ever written onchain plus any retained logs, and future cryptanalysis such as a large quantum computer that breaks elliptic-curve key exchange and pairings, but not hashes, symmetric ciphers or lattices.',
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

/** Title of the interior field chips; entry and exit are public and have none. */
export const PRIVACY_INTERIOR_LABEL = 'Inside'

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

/** Worst leak beyond the public observer. */
export function worstExtraLeak(
  cell: PrivacyAdversarySummaryCell,
): PrivacyExposure | undefined {
  const worst = cell.alsoExposed
    .map((f) => f.exposure)
    .reduce<PrivacyExposure>(
      (a, b) => (SEVERITY[b] > SEVERITY[a] ? b : a),
      'private',
    )
  return worst === 'private' ? undefined : worst
}
