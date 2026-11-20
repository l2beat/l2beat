import type {
  PrivacyAdversaryId,
  PrivacyRisk,
  PrivacyRiskCategory,
} from '../types'

/** The risk summary's headings, in the order the page lists them. */
export const PRIVACY_RISK_CATEGORIES = {
  stolen: 'Funds can be stolen if',
  lost: 'Funds can be lost if',
  frozen: 'Funds can be frozen if',
  stopped: 'Use can be stopped if',
  privacy: 'Privacy can be lost if',
} as const satisfies Record<string, PrivacyRiskCategory>

type PrivacyRiskGroup = keyof typeof PRIVACY_RISK_CATEGORIES

/** A sentence alone, or with the adversary cells that explain it. */
export type PrivacyRiskItem =
  | string
  | { text: string; see: PrivacyAdversaryId[] }

/** Orders a project's risks under the shared headings. */
export function definePrivacyRisks(
  groups: Partial<Record<PrivacyRiskGroup, PrivacyRiskItem[]>>,
): PrivacyRisk[] {
  return Object.entries(PRIVACY_RISK_CATEGORIES).flatMap(([group, category]) =>
    (groups[group as PrivacyRiskGroup] ?? []).map((item) =>
      typeof item === 'string'
        ? { category, text: item }
        : { category, ...item },
    ),
  )
}

/** Risk sentences that at least four projects print unchanged. */
export const PRIVACY_RISK_SNIPPETS = {
  /** `actions` is what the proofs authorize: a pool has only withdrawals. */
  proofSystem: (actions: 'withdrawals' | 'spends or withdrawals') =>
    `the zk proof system is broken, allowing invalid ${actions}.`,
  trustedSetup:
    'all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.',
} as const
