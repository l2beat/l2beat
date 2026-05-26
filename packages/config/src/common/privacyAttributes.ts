import type { PrivacyAttribute } from '../types'

export const PRIVACY_ATTRIBUTES = {
  upgradeable: {
    id: 'upgradeable',
    label: 'Upgradeable',
    description:
      'DAO can vote on upgrades that are executable with a 7d delay.',
  },
  optCompliance: {
    id: 'optCompliance',
    label: 'Opt compliance',
    description:
      "Optional 'proofs of innocence' (POIs), can disassociate the deposit from a list of flagged addresses.",
  },
  transfers: {
    id: 'transfers',
    label: 'Transfers',
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
    label: 'Any amount',
    description: 'Deposits and withdrawals can have any size.',
  },
  fixedAmounts: {
    id: 'fixedAmounts',
    label: 'Fixed amounts',
    description:
      'Pre-defined transfer amounts use distinct buckets (anonymity sets).',
  },
  sourceAvailable: {
    id: 'sourceAvailable',
    label: 'Source available',
    description:
      'There is at least one practical way to use exclusively auditable, source-available software to interact with this protocol.',
  },
  immutable: {
    id: 'immutable',
    label: 'Immutable',
    description: 'Core smart contract code cannot be changed.',
  },
  uncensorable: {
    id: 'uncensorable',
    label: 'Uncensorable',
    description: 'Deposits and withdrawals cannot be censored.',
  },
  enforcedCompliance: {
    id: 'enforcedCompliance',
    label: 'Enforced compliance',
    description:
      'ASPs (association set providers) can censor any deposits, excluding them from the anonymity set.',
  },
} as const satisfies Record<string, PrivacyAttribute>
