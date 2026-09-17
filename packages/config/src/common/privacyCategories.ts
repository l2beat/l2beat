import type { PrivacyCategory } from '../types'

/**
 * The mechanism a project deploys, read from its code, never from the
 * privacy it achieves. A project that fails to deliver its category's promise
 * keeps the category and gets red adversary cells instead.
 */
export const PRIVACY_CATEGORIES = {
  pool: {
    id: 'pool',
    label: 'Pool',
    description:
      'Funds enter a shared pool and leave it later, with no transfers inside. Hides which deposit funds which withdrawal.',
  },
  shieldedLedger: {
    id: 'shieldedLedger',
    label: 'Shielded ledger',
    description:
      'A pool with transfers or DeFi inside. Hides who pays whom and which deposit funds which withdrawal.',
  },
  stealthAddress: {
    id: 'stealthAddress',
    label: 'Stealth address',
    description:
      'Payments land on fresh one-time addresses. Hides which recipient a payment is for.',
  },
  confidentialAmounts: {
    id: 'confidentialAmounts',
    label: 'Confidential amounts',
    description:
      'Accounts and counterparties are public, balances and transfer amounts are encrypted.',
  },
} as const satisfies Record<string, PrivacyCategory>
