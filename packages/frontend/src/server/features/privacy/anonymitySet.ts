/**
 * Hardcoded demo data for the "30 days best anonymity set" column on the
 * privacy summary table. Keyed by project slug. Projects without an entry
 * (e.g. strk20) render as no data.
 */
export interface AnonymitySet {
  /** Size of the biggest identified 30 day rolling anonymity set. `null` renders as "N/A". */
  setSize: number | null
  description: string
  /** Protocol-specific "how to mix" steps. Omitted when the protocol has no anonymity set. */
  steps?: string[]
}

export const ANONYMITY_SETS: Record<string, AnonymitySet> = {
  'tornado-cash': {
    setSize: 4000,
    description:
      'Number of unique depositors in the 0.1 ETH bucket in the last 30 days.',
    steps: [
      'Deposit into the 0.1 ETH Tornado Cash pool on Ethereum.',
      'Wait for a randomized duration of time up to 30 days. Do not rely on a human judgement to pick a random number.',
      'Withdraw to an unlinkable address.',
    ],
  },
  railgun: {
    setSize: 1000,
    description:
      'Number of unique depositors of the WETH token with an amount of at least 1 WETH in the last 30 days.',
    steps: [
      'Deposit at most 1 WETH into the Railgun protocol.',
      'Wait for a randomized duration of time up to 30 days. Do not rely on a human judgement to pick a random number.',
      'Withdraw to an unlinkable address. Make sure the withdrawal amount is not equal to the deposit amount, leaving a small amount still deposited.',
    ],
  },
  'privacy-pools': {
    setSize: 450,
    description:
      'Number of unique depositors of the ETH token with an amount of at least 1 ETH in the last 30 days.',
    steps: [
      'Deposit at most 1 ETH into the Privacy Pools protocol.',
      'Wait for a randomized duration of time up to 30 days. Do not rely on a human judgement to pick a random number.',
      'Withdraw to an unlinkable address. Make sure the withdrawal amount is not equal to the deposit amount, leaving a small amount still deposited.',
    ],
  },
  'zama-confidential-tokens': {
    setSize: null,
    description:
      'Zama protocol does not have a notion of an anonymity set. Sender and receiver addresses of confidential tokens are publicly known, only the amounts are hidden.',
  },
}
