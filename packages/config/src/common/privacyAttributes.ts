import type { PrivacyAttribute } from '../types'

export const PRIVACY_ATTRIBUTES = {
  upgradeable: {
    id: 'upgradeable',
    label: 'Upgradeable',
    description: 'Smart contract code can be upgraded.',
  },
  optCompliance: {
    id: 'optCompliance',
    label: 'Opt compliance',
    description:
      'Users are not forced to provide compliance data by the core protocol.',
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
      'There is at least one practical way to exclusively use auditable, source-available software to interact with this protocol.',
  },
  closedSource: {
    id: 'closedSource',
    label: 'Closed source',
    description:
      'The protocol program or circuit is not open source, so users cannot independently inspect the implementation or know what is verified by the smart contract.',
  },
  immutable: {
    id: 'immutable',
    label: 'Immutable',
    description: 'Core smart contract code cannot be changed.',
  },
  unconditionalPrivacy: {
    id: 'unconditionalPrivacy',
    label: 'Unconditional privacy',
    description:
      'Deposits and withdrawals cannot be censored or linked by the protocol.',
  },
  enforcedCompliance: {
    id: 'enforcedCompliance',
    label: 'Enforced compliance',
    description:
      'Compliance checks are enforced by the protocol and can restrict privacy set participation.',
  },
} as const satisfies Record<string, PrivacyAttribute>
