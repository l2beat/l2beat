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
      condition: 'first contacts and fee token are public',
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
      sentiment: 'warning',
      condition: 'long hold, uneven amount, STRK fees',
      exposure:
        'Under three thousand registered users and about a hundred transactions a day, split across tokens, leave a small set to hide in. No delay is enforced, the fee token is public, and a channel opened in the same transaction as a deposit ties the two together.',
      advice:
        'Hold funds in the pool for a long time, withdraw uneven amounts that match no deposit, pay fees in STRK, and make your first payment to a new contact in a transaction without a deposit.',
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
      sentiment: 'warning',
      condition: 'paymaster gets IP and a non-zero-knowledge proof',
      exposure:
        "Transactions reach the chain through the AVNU paymaster and the sequencer, which see the encrypted actions, public a block later anyway, your IP, and the client proof. That proof is not zero-knowledge by default, so what its bytes reveal about your actions is unverified. The operator's prover and discovery service, which receive your viewing key, are covered under privileged insider.",
      advice:
        'Use a wallet that routes requests through an OHTTP relay, and let the paymaster submit rather than your own account, which would name you publicly.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'The paymaster holds a proof that is not zero-knowledge; whether it leaks the link is unverified.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'IP reaches the paymaster and the node; an OHTTP relay hides it.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Encrypted in calldata; the non-zero-knowledge proof is the unverified caveat.',
        },
        recipient: {
          verdict: 'atRisk',
          note: 'Same caveat as sender.',
        },
        amount: {
          verdict: 'atRisk',
          note: 'Same caveat as sender.',
        },
        asset: {
          verdict: 'atRisk',
          note: 'Fee token public; otherwise same caveat as sender.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'Same caveat as sender.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'IP reaches the paymaster and the node; an OHTTP relay hides it.',
        },
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
      condition: 'prover and auditor key read everything',
      exposure:
        "The operator's prover receives your private viewing key and every action in the clear, and the discovery service receives the viewing key again on every sync, so the operator sees everything you do. Every user's viewing key is also escrowed to a single auditor key held by the operators, and every deposit needs a screener's signature.",
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
