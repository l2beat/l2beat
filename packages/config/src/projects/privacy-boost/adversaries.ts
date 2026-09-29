import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const PROTOCOL =
  'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/contracts/src/'
const SDK = 'https://www.npmjs.com/package/@sunnyside-io/privacy-boost'

export const privacyBoostAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the ledger, including which deposits fund a withdrawal. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure: `Transfers inside publish only encrypted notes. ${S.entryExitPublic()} Each epoch's calldata pairs every exit with the nullifiers and the input/output shape of the transfer that funded it.`,
      advice:
        "Exit through the operator's relay; a forced exit reveals your account and the notes you spend. A public gift exit names the destination.",
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
          note: 'Epoch calldata ties each exit to the nullifiers and shape of one transfer.',
        },
      },
      sources: [
        { contract: 'PrivacyBoost' },
        {
          title: 'Epoch calldata: withdrawals, nullifiers and transfer shapes',
          url: PROTOCOL + 'interfaces/IPrivacyBoost.sol#L828-L852',
        },
        {
          title: 'Forced withdrawal publishes account, destination and notes',
          url: PROTOCOL + 'interfaces/IPrivacyBoost.sol#L582-L592',
        },
        {
          title: 'Gift claim and refund are indistinguishable',
          url: PROTOCOL + 'interfaces/IPrivacyBoost.sol#L694-L707',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      exposure:
        'The anonymity set is small, so most withdrawals can be linked to their funding deposits by amount and timing.',
      advice:
        'There is currently no crowd to hide in. Keep funds inside and transfer often, withdraw amounts that match no deposit, and never exit to an address that has deposited.',
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
          note: 'The anonymity set is too small for care to hide the link.',
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
        "All shielded actions go to the operator's server as an encrypted envelope, and note keys stay in a local vault. Only the operator's relay submits epochs onchain, so nothing of yours reaches a public node.",
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
        "The operator runs the enclave that holds every transfer in plaintext and the key to every onchain note. The client fetches that key from the operator's web endpoint and the published SDK checks no enclave attestation, so a substituted key would read every note unnoticed. Appointed auditors can pull any account's history without consent, and the audit log is written by the operator's own unpublished code.",
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
        { title: 'TEE key is fetched from the operator endpoint', url: SDK },
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
        "Every note wraps its key to the enclave's long-lived elliptic-curve public key as well as the receiver's. A quantum computer, or a leak of that one key, decrypts the entire history.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { contract: 'PrivacyBoost', title: 'Ciphertext layout' },
        {
          title:
            'Every output and deposit ciphertext carries a TEE-wrapped key',
          url: PROTOCOL + 'interfaces/IStructs.sol#L36-L125',
        },
      ],
    },
  },
})
