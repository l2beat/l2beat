import type { PrivacyCategory, PrivacyNeed, PrivacyNeedId } from '../types'

/**
 * The mechanism a project deploys, read from its code.
 * A project that fails to deliver its category's promise
 * keeps the category and gets red adversary cells.
 */
export const PRIVACY_CATEGORIES = {
  anonymousAccess: {
    id: 'anonymousAccess',
    label: 'Anonymous access',
    description:
      'Proves eligibility to use a service without revealing which account or deposit grants access.',
    need: 'useService',
  },
  pool: {
    id: 'pool',
    label: 'Pool',
    description:
      'Funds enter a shared pool and leave it later, with no actions inside. Hides which deposit became which withdrawal.',
    need: 'moveFunds',
  },
  shieldedLedger: {
    id: 'shieldedLedger',
    label: 'Shielded ledger',
    description:
      'A pool with transfers or DeFi inside. Hides who pays whom and which deposit became which withdrawal.',
    need: 'moveFunds',
  },
  stealthAddress: {
    id: 'stealthAddress',
    label: 'Stealth address',
    description:
      'Payments land on fresh one-time addresses. Hides which recipient a payment is for.',
    need: 'getPaid',
  },
  confidentialAmounts: {
    id: 'confidentialAmounts',
    label: 'Confidential amounts',
    description:
      'Accounts and counterparties are public, balances and transfer amounts are encrypted.',
    need: 'hideAmounts',
  },
  secretBallot: {
    id: 'secretBallot',
    label: 'Secret ballot',
    description:
      'Voters and their voting power are public, ballots are encrypted and only the tally is decrypted. Hides which option each voter chose.',
    need: 'vote',
  },
} as const satisfies Record<string, PrivacyCategory>

/**
 * The needs in the order the guide offers them, most used first. A category
 * names its need, so a new category cannot be left without one.
 */
export const PRIVACY_NEEDS: Record<PrivacyNeedId, PrivacyNeed> = {
  moveFunds: {
    id: 'moveFunds',
    label: 'Move funds without a link',
    description:
      'Funds leave to an address that cannot be tied to the one they came from.',
  },
  getPaid: {
    id: 'getPaid',
    label: 'Get paid without showing your account',
    description:
      'Each payment lands on a fresh address that only you can tie to your account.',
  },
  hideAmounts: {
    id: 'hideAmounts',
    label: 'Hide amounts',
    description:
      'Balances and transfer amounts are encrypted. Accounts and counterparties stay public.',
  },
  useService: {
    id: 'useService',
    label: 'Use a paid service anonymously',
    description:
      'The service is paid without learning which deposit or account pays.',
  },
  vote: {
    id: 'vote',
    label: 'Vote in secret',
    description: 'A vote counts without showing which option you chose.',
  },
}
