import type { PrivacyAttribute } from '../types'

export const PRIVACY_ATTRIBUTES = {
  upgradeable: {
    id: 'upgradeable',
    label: 'upgradeable',
    description:
      'DAO can vote on upgrades that are executable with a 7d delay.',
  },
  optCompliance: {
    id: 'optCompliance',
    label: 'opt compliance',
    description:
      "Optional 'proofs of innocence' (POIs), can disassociate the deposit from a list of flagged addresses.",
  },
  transfers: {
    id: 'transfers',
    label: 'transfers',
    description: 'Private transfers within the shielded pool.',
  },
  defi: {
    id: 'defi',
    label: 'DeFi',
    description:
      'Interop with DeFi (swaps, vaults) from within the shielded pool.',
  },
  anyAmount: {
    id: 'anyAmount',
    label: 'any amount',
    description: 'Deposits and withdrawals can have any size.',
  },
  fixedAmounts: {
    id: 'fixedAmounts',
    label: 'fixed amounts',
    description:
      'Pre-defined transfer amounts use distinct buckets (anonymity sets).',
  },
  openSource: {
    id: 'openSource',
    label: 'open source',
    description:
      'There is at least one practical way to use exclusively open source software to interact with this protocol.',
  },
  immutable: {
    id: 'immutable',
    label: 'immutable',
    description: 'Core smart contract code cannot be changed.',
  },
  uncensorable: {
    id: 'uncensorable',
    label: 'uncensorable',
    description: 'Deposits and withdrawals cannot be censored.',
  },
  enforcedCompliance: {
    id: 'enforcedCompliance',
    label: 'enforced compliance',
    description:
      'ASPs (association set providers) can censor any deposits, excluding them from the anonymity set.',
  },
} as const satisfies Record<string, PrivacyAttribute>
