import type {
  PrivacyAdversaryId,
  PrivacyRiskCategory,
  PrivacyRiskGroup,
} from '../types'

/** The risk summary's headings, in the order the page lists them. */
const PRIVACY_RISK_CATEGORIES = [
  ['stolen', 'Funds can be stolen if'],
  ['lost', 'Funds can be lost if'],
  ['frozen', 'Funds can be frozen if'],
  ['stopped', 'Use can be stopped if'],
  ['privacy', 'Privacy can be lost if'],
] as const satisfies [string, PrivacyRiskCategory][]

type PrivacyRiskKey = (typeof PRIVACY_RISK_CATEGORIES)[number][0]

/** A sentence alone, or with the adversary cells that explain it. */
type PrivacyRiskItem = string | { text: string; see: PrivacyAdversaryId[] }

/** Puts a project's risks under the shared headings, in the shared order. */
export function definePrivacyRisks(
  risks: Partial<Record<PrivacyRiskKey, PrivacyRiskItem[]>>,
): PrivacyRiskGroup[] {
  return PRIVACY_RISK_CATEGORIES.flatMap(([key, category]) => {
    const items = risks[key] ?? []
    if (items.length === 0) return []
    return {
      category,
      risks: items.map((item) =>
        typeof item === 'string' ? { text: item } : item,
      ),
    }
  })
}

/** Risk sentences that at least four projects print unchanged. */
export const PRIVACY_RISK_SNIPPETS = {
  /** `actions` is what the proofs authorize: a pool has only withdrawals. */
  proofSystem: (actions: 'withdrawals' | 'spends or withdrawals') =>
    `the zk proof system is broken, allowing invalid ${actions}.`,
  trustedSetup:
    'all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.',
} as const
