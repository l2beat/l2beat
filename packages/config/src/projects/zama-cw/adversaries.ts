import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

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
      sentiment: 'good',
      exposure:
        'Only the amount of a confidential transfer is hidden; unwrapping publishes it, and a failed unwrap reveals your balance was below it. Who pays whom and every wrap and unwrap amount are public.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [{ contract: 'ConfidentialUSDCWrapper' }],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        "Since all wraps and unwraps are public, an account's balance is bounded by what went in and out, and exact for any account that never made a confidential transfer.",
      advice:
        'Keep funds wrapped and transfer often; only an account with confidential transfers between wrap and unwrap has a hidden balance.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by public wrap and unwrap totals; exact for accounts with few transfers.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [{ contract: 'ConfidentialUSDCWrapper' }],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'Amounts are encrypted on your device; on the wire there is nothing but encrypted traffic to Zama.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
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
      sentiment: 'bad',
      exposure:
        "The KMS key holders can together decrypt every balance and transfer ever made, and the token owner can appoint an observer with the same power at any time, with no delay. Zama's mandatory relayer sees who transacts and under which app's API key; Zama also runs the coprocessor and KMS nodes of its own.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'To the KMS at threshold, or to any owner-appointed observer. No observer is set today.',
        },
        asset: 'exposed',
        linkage: 'exposed',
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
      sentiment: 'warning',
      exposure:
        'The encryption itself survives quantum computers, but every ciphertext is publicly downloadable today and one long-lived key protects them all. If enough key shares ever leak, the entire history is exposed.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Lattice cryptography and one long-lived key.',
        },
        asset: 'exposed',
        linkage: 'exposed',
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
