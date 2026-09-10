import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by the .flat sources (PrivacyBoost pool, AuthRegistry,
// AuditGateway, ExternalCallGateway, Groth16 verifiers), discovered.json, the
// published SDK wrapper (its Rust core and the TEE server are closed) and a
// decode of all pool events on OP Mainnet. Measurements as of 2026-09-08,
// OP Mainnet block 156,644,698.
export const privacyBoostAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the ledger and the link between deposit and withdrawal. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      condition: 'forced exits reveal the notes spent',
      exposure:
        'Deposits and withdrawals show address, token and amount. Transfers inside publish only encrypted notes, and the link between deposit and withdrawal is hidden.',
      advice:
        "Exit through the operator's relay. A forced exit reveals your account and the exact notes you spend.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'private',
          note: 'Leaked for gateway DeFi legs.',
        },
        asset: {
          verdict: 'private',
          note: 'Leaked for gateway DeFi legs.',
        },
        linkage: {
          verdict: 'private',
          note: 'One transfer per epoch: timing and input/output shape of every transfer are public.',
        },
      },
      sources: [{ contract: 'PrivacyBoost' }],
    },
    chainAnalyst: {
      sentiment: 'bad',
      condition: 'tiny real set; exits equal note minus fee',
      exposure:
        'Almost all activity is one operator address cycling a fixed amount on a fixed cadence, which is easy to filter out. The real anonymity set is what remains, and every exit is the note it spends minus the fixed fee, so amount matching alone pairs a deposit with its exit.',
      interior: {
        sender: 'atRisk',
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by the public deposit and exit amounts of the real users.',
        },
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden only if a transfer coincides with the heartbeat cadence.',
        },
      },
      sources: [
        {
          title: 'Operator heartbeat address',
          url: 'https://optimistic.etherscan.io/address/0x1b10c04536c01a51cb5d20cf3ac717047303d89c',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      condition: 'only an encrypted envelope',
      exposure:
        "All shielded actions go to the operator's server as an encrypted envelope behind Cloudflare.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
      },
      sources: [
        {
          title: 'SDK (closed Rust core)',
          url: 'https://www.npmjs.com/package/@sunnyside-io/privacy-boost',
        },
        {
          title: 'Server info endpoint',
          url: 'https://optimism.privacyboost.io/api/v1/info',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'operator holds the plaintext ledger',
      exposure:
        'The operator runs the enclave that holds every transfer in plain text and the key to every onchain note. The app sends your wallet address, note key and every transfer to that server without verifying it is the enclave it claims to be. The same people can upgrade all contracts with no delay, and appointed auditors could read any account; none is appointed yet.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { contract: 'AuditGateway' },
        { section: 'permissions', title: 'Admin and operator multisigs' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      condition: 'every ciphertext wrapped to a public static key',
      exposure:
        "Every note onchain is encrypted to the enclave's public key, which never changes. A quantum computer, or a leak of that one key, decrypts the entire history.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'PrivacyBoost',
          title: 'Ciphertext layout in the pool contract',
        },
      ],
    },
  },
})
