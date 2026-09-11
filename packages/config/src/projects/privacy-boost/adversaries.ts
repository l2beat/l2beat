import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const PROTOCOL =
  'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/contracts/src/'
const SDK = 'https://www.npmjs.com/package/@sunnyside-io/privacy-boost'

export const privacyBoostAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the ledger and the link between deposit and withdrawal. A withdrawal can consume multiple inputs.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Transfers inside publish only encrypted notes, and the link between deposit and withdrawal is hidden. Deposits and withdrawals show address, token and amount, and each epoch is submitted as public calldata that pairs every exit with the nullifiers of the transfer that funded it and states how many inputs and outputs that transfer had.',
      advice:
        "Exit through the operator's relay. A forced exit reveals your account and the exact notes you spend. Gift claims and refunds look the same on chain, but a public gift exit names the destination.",
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
          note: 'Epoch calldata ties each public exit to the nullifiers and the input/output shape of one transfer.',
        },
      },
      sources: [
        { contract: 'PrivacyBoost' },
        {
          title:
            'Epoch calldata carries withdrawals, per-slot nullifiers and transfer shapes',
          url: PROTOCOL + 'interfaces/IPrivacyBoost.sol#L828-L852',
        },
        {
          title:
            'Forced withdrawal publishes the account, the destination and the spent notes',
          url: PROTOCOL + 'interfaces/IPrivacyBoost.sol#L582-L592',
        },
        {
          title: 'Gift claim and refund are deliberately indistinguishable',
          url: PROTOCOL + 'interfaces/IPrivacyBoost.sol#L694-L707',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      exposure:
        'Small anonymity set, so most withdrawals can be linked to their funding deposits.',
      advice:
        'Do not exit to an address that has deposited. Keep funds wrapped and transfer often within the pool. Do not withdraw right after depositing, and do not withdraw an amount that matches a recent deposit. There is currently no crowd to hide in.',
      interior: {
        sender: 'atRisk',
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by the public deposit and exit amounts.',
        },
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Small anonymity set and bad pool hygiene make privace impractical.',
        },
      },
      sources: [
        {
          title: 'Operator heartbeat address',
          url: 'https://optimistic.etherscan.io/address/0x1b10c04536c01a51cb5d20cf3ac717047303d89c',
        },
        { contract: 'PrivacyBoost', title: 'Withdrawal fee in basis points' },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        "All shielded actions go to the operator's server as an encrypted envelope behind a commercial front end, and note keys stay in a local vault that is unlocked by a passphrase. Only the operator's single permitted relay submits epochs on chain, so nothing of yours reaches a public node. Whether the central operator shares this data is unclear.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
      },
      sources: [
        { title: 'SDK package, closed Rust core', url: SDK },
        {
          title: 'Server info endpoint',
          url: 'https://optimism.privacyboost.io/api/v1/info',
        },
        { contract: 'PrivacyBoost', title: 'Single permitted relay' },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "The operator runs the enclave that holds every transfer in plain text and the key to every onchain note. The client fetches that key from the operator's own web endpoint and nothing in the published SDK checks an enclave attestation, so a substituted key would read every note without users noticing. Appointed auditors can pull any account's balance and history without consent. The record that is meant to prove an audit happened is written by the operator's own logger, and the code that should write it is not published.",
      advice:
        'Treat everything in the pool as visible to the operator. A forced exit is the only path that does not need it, and it is public.',
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
        {
          title: 'TEE key is auto-discovered from the operator endpoint',
          url: SDK,
        },
        {
          title:
            'Notes wrap an ephemeral key for the TEE alongside the receiver',
          url: PROTOCOL + 'interfaces/IStructs.sol#L36-L56',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        "Every note onchain wraps its key to the enclave's public key as well as the receiver's, and that one long-lived key is elliptic-curve. A quantum computer, or a leak of that single key, decrypts the entire history.",
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
        {
          title:
            'Every output and deposit ciphertext carries a TEE-wrapped key',
          url: PROTOCOL + 'interfaces/IStructs.sol#L36-L125',
        },
      ],
    },
  },
})
