import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const REPO = 'https://github.com/starkware-libs/starknet-privacy/blob/main'
const POOL =
  'https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a'

// Verdicts backed by .flat/PrivacyPool.cairo, the starknet-privacy repository
// (contract, SDK, prover and discovery service), the STRK-20 paper and a full
// decode of the pool's apply_actions transactions on Starknet. Starknet L2
// data is treated as public. Measurements as of 2026-09-08, Starknet block
// 14,566,177.
export const strk20Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides amounts and senders inside the pool, and the link between deposit and withdrawal. Deposits, withdrawals and first contacts are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Transfers inside are encrypted, but the first payment to any new recipient writes their address in the clear, and the fee refund reveals which token you pay fees in. Deposits and withdrawals show address, token and amount.',
      advice:
        'Pay fees in STRK, let the paymaster submit, and treat the first payment to a new recipient as public.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'exposed',
          note: 'Opening a channel to a new counterparty writes the recipient address in cleartext; later transfers in the channel do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'The fee refund reveals the fee token; use STRK.',
        },
        linkage: 'private',
      },
      sources: [
        { title: 'PrivacyPool contract on Voyager', url: POOL },
        {
          title: 'starknet-privacy repository',
          url: 'https://github.com/starkware-libs/starknet-privacy',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'The anonymity set is small and split across tokens. No delay is enforced, the fee token is public, and a channel opened in the same transaction as a deposit ties the two together.',
      advice:
        'Hold funds in the pool for a long time, withdraw uneven amounts that match no deposit, pay fees in STRK, and make your first payment to a new contact in a transaction without a deposit.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Channel opening in the same transaction as a deposit names the depositor as sender.',
        },
        recipient: 'exposed',
        amount: 'private',
        asset: 'atRisk',
        linkage: 'atRisk',
      },
      sources: [{ title: 'PrivacyPool contract on Voyager', url: POOL }],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'The AVNU paymaster and the sequencer receive the encrypted actions and the client proof. That proof is not zero-knowledge by default, so what its bytes reveal is unverified.',
      interior: {
        sender: 'unverifiable',
        recipient: 'unverifiable',
        amount: 'unverifiable',
        asset: 'atRisk',
        linkage: 'unverifiable',
      },
      sources: [
        {
          title: 'Proving request includes viewing key',
          url: `${REPO}/sdk/src/internal/proof-invocation-factory.ts`,
        },
        {
          title: 'Discovery service API',
          url: `${REPO}/crates/discovery-service/README.md`,
        },
        {
          title: 'Stwo is not zero-knowledge by default',
          url: 'https://github.com/starkware-libs/stwo-cairo#security-model',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "The operator's prover receives your viewing key and every action in the clear, and the discovery service receives the viewing key on every sync. Every user's viewing key is also escrowed to a single auditor key held by the operators, and every deposit needs the signature of the screener, Elliptic.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { title: 'Auditor and screener keys in storage', url: POOL },
        {
          title: 'Discovery service (viewing key per request)',
          url: `${REPO}/crates/discovery-service/README.md`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'The auditor escrow uses elliptic-curve encryption and sits onchain. A quantum computer recovers the auditor key and with it every transfer, amount and recipient ever made.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { title: 'Stark-curve ECDH encryption (SDK)', url: `${REPO}/sdk/src` },
      ],
    },
  },
})
