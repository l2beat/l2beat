import type {
  PrivacyAdversaryId,
  PrivacyExposure,
  PrivacyField,
  PrivacyFieldExposure,
} from '@l2beat/config'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'

export const PRIVACY_ADVERSARIES_TOOLTIP =
  'Ethereum is public: every address keeps its past and its future in the open, and a privacy protocol can at best cut the link between them, hide who receives, or hide how much. One dot per adversary, in order of reach: public observer, chain analyst, network observer, privileged insider, future adversary. The colour says whether a careful user can keep the promised field private against that adversary using the protocol and its supported client options: green yes, yellow only outside supported options or by accepting another leak, red no.'

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

export const EXPOSURE_TEXT_CLASS: Record<PrivacyExposure, string> = {
  private: 'text-[#2C8A57] dark:text-[#4FC98B]',
  atRisk: 'text-[#C9900E] dark:text-[#E7A63A]',
  exposed: 'text-[#C2413E] dark:text-[#F07670]',
  unverifiable: 'text-[#6A5DB5] dark:text-[#AA9DEA]',
}

/** What the protocol promises to hide, as the subtext under the dots. */
export const PRIVACY_PROMISE_LABEL: Record<PrivacyField, string> = {
  sender: 'Hides the sender',
  recipient: 'Hides the recipient',
  amount: 'Hides amounts',
  asset: 'Hides the asset',
  linkage: 'Hides the link',
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

/** Anchor of an adversary block inside the project page section. */
export function getPrivacyAdversaryAnchor(id: PrivacyAdversaryId): string {
  return `privacy-adversaries-${id}`
}

/** Sort key for the summary table: red cells weigh more than yellow ones. */
export function getPrivacyAdversaryRank(
  cells: PrivacyAdversarySummaryCell[],
): number {
  let rank = 0
  for (const cell of cells) {
    if (cell.sentiment === 'bad') rank += 10
    if (cell.sentiment === 'warning') rank += 1
  }
  return rank
}
