import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const SDK = 'https://github.com/zama-ai/relayer-sdk/blob/main'
const CUSDC =
  'https://etherscan.io/address/0xe978F22157048E5DB8E5d07971376e86671672B2'

// Verdicts backed by .flat/ConfidentialUSDCWrapper, .flat/ACL, .flat/KMSVerifier,
// discovered.json (Ethereum + gateway chain) and the relayer-sdk source.
// Measurements as of 2026-09-08, block 25,931,789.
export const zamaCwAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'amount',
    text: 'Hides transfer amounts. Who pays whom, and every wrap and unwrap amount, is public.',
  },
  cells: {
    publicObserver: {
      condition: 'graph and boundary amounts public',
      sentiment: 'good',
      exposure:
        'Who pays whom, and every wrap and unwrap with its exact amount, is public. Only the amount of a confidential transfer is hidden; unwrapping publishes it, and a failed unwrap reveals that your balance was below it.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'private',
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'private',
      },
      sources: [{ contract: 'ConfidentialUSDCWrapper' }],
    },
    chainAnalyst: {
      condition: 'bounded by wrap and unwrap totals',
      sentiment: 'warning',
      exposure:
        "Since all wraps and unwraps are public, an account's balance is bounded by what went in and out, and exact for the half of users who never transferred.",
      advice:
        'Keep funds wrapped and transfer often; only an account with confidential transfers between wrap and unwrap has a hidden balance.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on any address in the public graph.',
        },
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by public wrap and unwrap totals; exact for accounts with few transfers.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
      },
      sources: [{ contract: 'ConfidentialUSDCWrapper' }],
    },
    networkObserver: {
      subject: 'identity',
      condition: 'mandatory relayer with API key',
      sentiment: 'bad',
      exposure:
        "Every transfer and every balance read goes through Zama's relayer with your IP and an API key; no other relayer exists. Amounts stay encrypted.",
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'exposed',
          note: 'The mandatory Zama relayer sees IP and API key with every input and balance read; no third-party relayer exists.',
        },
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'private',
          note: 'Relayer and coprocessor see ciphertexts and handles, not plaintext.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
      },
      sources: [
        {
          title: 'Relayer default URL',
          url: 'https://github.com/zama-ai/relayer-sdk/blob/main/src/configs.ts',
        },
        {
          title: 'User decryption request',
          url: 'https://github.com/zama-ai/relayer-sdk/blob/main/src/relayer/userDecrypt.ts',
        },
      ],
    },
    privilegedInsider: {
      condition: 'KMS or owner can decrypt',
      sentiment: 'bad',
      exposure:
        'Thirteen key holders can together decrypt every balance and transfer ever made, and the token owner can appoint an observer with the same power at any time, with no delay.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'exposed',
          note: 'Zama operates the relayer, the coprocessor and two KMS nodes.',
        },
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'To the KMS at threshold, or to any owner-appointed observer. No observer is set today.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
      },
      sources: [
        {
          contract: 'ConfidentialUSDCWrapper',
          title: 'Wrapper (addObserver, blockUser)',
        },
        { contract: 'ProtocolConfig' },
        { contract: 'KMSVerifier' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      condition: 'ciphertexts public, one key',
      sentiment: 'warning',
      exposure:
        'The encryption itself survives quantum computers, but every ciphertext is publicly downloadable today and one long-lived key protects them all. If enough key shares ever leak, the entire history is exposed.',
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
        amount: {
          verdict: 'private',
          note: 'Hidden by lattice cryptography only. Every ciphertext is publicly downloadable from the coprocessor bucket, so a future KMS key compromise is retroactive and total.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Coprocessor ciphertext store (public listing)',
          url: 'https://coprocessor-1.mainnet.zama.org/?max-keys=3',
        },
        {
          title: 'ML-KEM hybrid encryption of decryption shares',
          url: 'https://github.com/zama-ai/kms/blob/main/core/service/src/cryptography/hybrid_ml_kem.rs',
        },
      ],
    },
  },
})
