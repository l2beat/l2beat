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
      sentiment: 'warning',
      condition: 'recipient exposed on first contact',
      exposure:
        'Deposits and withdrawals show address, token and amount. Transfers inside are encrypted, but the first payment to any new recipient writes their address in the clear, and the fee refund reveals which token you pay fees in.',
      advice:
        'Pay fees in STRK, and treat the first payment to any new recipient as public.',
      boundary: {
        sender: {
          verdict: 'exposed',
          note: 'Withdrawals are submitted by paymaster relayers; self-submitted transactions expose the user account.',
        },
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'private',
        identity: 'private',
      },
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'exposed',
          note: 'Opening a channel to a new counterparty writes the recipient address in cleartext; later transfers in the channel do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'The fee reimbursement withdrawal reveals which token the sender pays fees in; use STRK.',
        },
        linkage: 'private',
        identity: 'private',
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
      sentiment: 'bad',
      condition: 'tiny set, one note per transaction',
      exposure:
        'With under three thousand users, one note per transaction and no delay, an analyst links most deposits to withdrawals by token, amount and timing. Half of all first payments are bundled with a public deposit.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden only with a long hold, a non-round amount, in-pool hops and STRK as fee token.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Starknet accounts carry public bridge and exchange history; deposit addresses are screened by Elliptic.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Channel opening in the same transaction as a deposit names the depositor as sender.',
        },
        recipient: 'exposed',
        amount: 'private',
        asset: 'atRisk',
        linkage: 'atRisk',
        identity: 'atRisk',
      },
      sources: [{ title: 'PrivacyPool contract on Voyager', url: POOL }],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'hosted prover and discovery hold the viewing key',
      exposure:
        "The wallet sends your private viewing key and every action in the clear to the operator's prover, and the viewing key again to the note discovery service. The operator sees everything you do.",
      advice:
        'Run your own prover and discovery service; both are open source, though no wallet offers this as a setting yet.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'exposed',
          note: 'The prover sees deposits, notes and withdrawal destinations of a user in cleartext.',
        },
        identity: {
          verdict: 'exposed',
          note: 'IP reaches prover, discovery and paymaster unless the optional OHTTP relay is configured.',
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
      condition: 'mandatory auditor key escrow',
      exposure:
        "Every user's viewing key is encrypted to a single auditor key held by the operators, who can read the entire history at any time. Every deposit also needs a screener's signature.",
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'exposed',
          note: 'To the auditor key holder, retroactively for every user.',
        },
        identity: {
          verdict: 'exposed',
          note: 'The screener and the operator prover see depositor addresses and IPs.',
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
        { title: 'Auditor and screener keys in storage', url: POOL },
        {
          title: 'Discovery service (viewing key per request)',
          url: `${REPO}/crates/discovery-service/README.md`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      condition: 'auditor escrow is elliptic-curve ECDH',
      exposure:
        'The auditor escrow uses elliptic-curve encryption and sits onchain. A quantum computer recovers the auditor key and with it every transfer, amount and recipient ever made.',
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
        { title: 'Stark-curve ECDH encryption (SDK)', url: `${REPO}/sdk/src` },
      ],
    },
  },
})
