import type { PrivacyAttribute } from '../types'

export const PRIVACY_ATTRIBUTES = {
  fhe: {
    id: 'fhe',
    label: 'FHE',
    description:
      'Uses fully homomorphic encryption for private computation over encrypted values.',
  },
  zk: {
    id: 'zk',
    label: 'ZK',
    description:
      'Uses zero-knowledge proofs to prove private actions without revealing private data.',
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
  privateAmounts: {
    id: 'privateAmounts',
    label: 'Private amounts',
    description:
      'Transfer amounts are private, while sender and recipient addresses remain public.',
  },
  tee: {
    id: 'tee',
    label: 'TEE',
    description:
      'Privacy assumptions of this project are secured by trusted hardware.',
  },
  stealthAddresses: {
    id: 'stealthAddresses',
    label: 'Stealth addresses',
    description:
      'Uses fresh, one-time recipient addresses to obscure who controls the receiving address.',
  },
} as const satisfies Record<string, PrivacyAttribute>
