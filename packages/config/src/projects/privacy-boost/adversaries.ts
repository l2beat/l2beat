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
      condition: 'exit through the relay, never forced',
      exposure:
        'Deposits and withdrawals show address, token and amount. Transfers inside publish only encrypted notes, and the link between deposit and withdrawal is hidden.',
      advice:
        "Exit through the operator's relay. A forced exit reveals your account and the exact notes you spend.",
      boundary: {
        sender: {
          verdict: 'exposed',
          note: 'The forced exit path additionally names the account owner through the public auth registry.',
        },
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'private',
          note: 'Leaked on the forced path, whose input commitments are identifiable leaves.',
        },
        identity: 'private',
      },
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
        identity: 'private',
      },
      sources: [{ contract: 'PrivacyBoost' }],
    },
    chainAnalyst: {
      sentiment: 'bad',
      condition: 'a few dozen real users, exact exit amounts',
      exposure:
        'Almost all activity is one operator address cycling 0.001 WETH every ten minutes, which is easy to filter out. What remains is a few dozen real users whose exits are always 0.996 times their deposit, minutes later.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the depositing EOA, which is also bound to an account id onchain.',
        },
      },
      interior: {
        sender: 'atRisk',
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by the public deposit and exit amounts of the few real users.',
        },
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden only if a transfer coincides with the heartbeat cadence.',
        },
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Operator heartbeat address',
          url: 'https://optimistic.etherscan.io/address/0x1b10c04536c01a51cb5d20cf3ac717047303d89c',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'single operator endpoint, no attestation check',
      exposure:
        'Every transfer, withdrawal and balance check goes to one operator server in plain text, including your wallet address and the key that identifies your notes. The app does not verify that the server is the enclave it claims to be.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'exposed',
          note: "The server receives every withdrawal request with its destination and the user's nullifying key.",
        },
        identity: {
          verdict: 'exposed',
          note: 'IP, wallet address and app identity on every login.',
        },
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
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
        'The operator runs the enclave that holds every transfer in plain text and the key that decrypts every onchain note, and the same people can upgrade all contracts with no delay. Appointed auditors could read any account; none has been appointed yet.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
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
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
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
