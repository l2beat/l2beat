import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const INTENTS =
  'https://github.com/near/intents/blob/fa44ede9e874931c39a6c4246de82bc40f4f8d99/'
const BRIDGE =
  'https://github.com/Near-One/btc-bridge/blob/4711c2f1d035a208464b9729bb24e45ed9ab7831/contracts/satoshi-bridge/src/'
const ZODL =
  'https://github.com/zodl-inc/zodl-ios/blob/15f1eed4024d2c996b0d38c746d5aed235704a01/secant/Sources/'
const FRONTEND =
  'https://github.com/defuse-protocol/defuse-frontend/blob/752a7838d1e73b00e6965a9cb6a08af68b447e41/src/'
const DOCS = 'https://docs.near-intents.org/'

export const zcashNearIntentsAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: "Hides which funds leaving Ethereum return as which funds, from inside Zcash's shielded pool. Everything on Ethereum and NEAR is public.",
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Both legs are public up to the edge of the shielded pool: the Ethereum address, asset and amount that fund a deposit, the NEAR ledger entries that credit, swap and withdraw them, and the amount that enters or leaves the pool. Every withdrawal on NEAR names the Zcash address it pays, and the bridge builds its shielded payouts so that anyone can decrypt the paid address and amount. Nothing ties the ZEC that went in to the ZEC that comes out.',
      advice:
        'Receive the ZEC straight into a shielded address, as Zodl does with a fresh address per swap, and pay the return leg from the pool. The web app pays transparent addresses only, which adds a public shielding step.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'atRisk',
          note: 'Every payout note to Zcash is decryptable by anyone, so a reused receiving address ties payouts together.',
        },
        amount: 'private',
        asset: {
          verdict: 'exposed',
          note: 'Only ZEC exists inside the pool and the assets swapped from and back into are public on NEAR.',
        },
        linkage: 'private',
      },
      sources: [
        {
          title:
            'Custodial bridge mint carries the Ethereum transaction hash in its memo',
          url: 'https://nearblocks.io/address/eth.omft.near',
        },
        {
          title: 'Withdrawal message names the target Zcash address',
          url: BRIDGE + 'api/token_receiver.rs#L8-L16',
        },
        {
          title: 'Payouts are encrypted to an all-zero outgoing viewing key',
          url: BRIDGE + 'zcash_utils/orchard_policy.rs#L13-L63',
        },
        {
          title: 'Zodl requests a fresh shielded address per swap',
          url: ZODL + 'Features/SwapAndPayForm/SwapAndPayStore.swift#L943',
        },
        {
          title: 'Web app accepts transparent and TEX addresses only',
          url:
            FRONTEND +
            'components/DefuseSDK/utils/validateAddress.ts#L131-L145',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        'The amount paid into the Zcash private pool and the amount later sent to a bridge deposit address are both public with their timing, and a round trip of about the same size within hours is a classic linking heuristic. Bridge deposit addresses are fresh per quote but are spent together with the bridge change address, so every exit is attributable to NEAR Intents.',
      advice:
        'Hold the ZEC in the pool for days, split or merge it with other shielded funds, and swap back amounts that match no payout.',
      interior: {
        sender: 'private',
        recipient: 'atRisk',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Round-trip amounts and timing across the pool edge pair a payout with a later deposit.',
        },
      },
      sources: [
        {
          title:
            'Kappos et al., An Empirical Analysis of Anonymity in Zcash (USENIX 2018)',
          url: 'https://arxiv.org/abs/1805.03180',
        },
        {
          title: 'Deposit address derived per quote from the deposit message',
          url: BRIDGE + 'deposit_msg.rs#L49-L52',
        },
        {
          title: 'Bridge change address and UTXO set',
          url: 'https://nearblocks.io/address/zcash-connector.bridge.near',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        'Zodl syncs through public lightwalletd servers, which see which full transactions the wallet fetches and which it broadcasts, naming the payout and the later exit of the same wallet. Tor in Zodl covers these calls and the swap requests but is off by default and does not cover block sync. Ethereum RPCs and NEAR relayers see only what is public anyway.',
      advice:
        'Turn on Tor in Zodl before the first swap, pin one server or your own lightwalletd in manual mode, and use a separate wallet account for each round trip.',
      interior: {
        sender: 'private',
        recipient: 'atRisk',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'The lightwalletd server sees the wallet fetch the payout transaction and later broadcast the exit.',
        },
      },
      sources: [
        {
          title: 'Tor is off unless the user enables it',
          url:
            ZODL + 'Dependencies/SDKSynchronizer/SDKSynchronizerLive.swift#L28',
        },
        {
          title: 'Default lightwalletd endpoint',
          url:
            ZODL +
            'Dependencies/ZcashSDKEnvironment/ZcashSDKEnvironmentInterface.swift#L21',
        },
        {
          title: 'Zashi 2.1: which calls Tor covers',
          url: 'https://electriccoin.co/blog/zashi-2-1-enhanced-privacy-with-tor-beta/',
        },
        {
          title:
            'Hornby, Fixing Privacy Problems in the Zcash Light Wallet Protocol',
          url: 'https://defuse.ca/downloads/Fixing%20Privacy%20Problems%20in%20the%20Zcash%20Light%20Wallet%20Protocol.pdf',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'The Operator runs the 1Click API, the Ethereum custody and the screening, so it holds both legs with the IP address and wallet identifiers of each request, plus the fresh Zcash refund address Zodl attaches to every swap out of ZEC. It screens every address with KYT vendors, can lock any account in the Verifier and can hold bridged funds. It has no key into the shielded pool, so joining the two legs still needs the IP, the session or timing.',
      advice:
        'Use Tor for both legs, do them from different sessions days apart, and keep the amounts small and apart.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'atRisk',
          note: 'The 1Click API receives a fresh refund address of the Zodl account for every swap out of ZEC.',
        },
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'IP address, partner key and timing of both legs sit in one operator’s logs.',
        },
      },
      sources: [
        {
          title: '1Click terms: IP and wallet data, screening, freezes',
          url: DOCS + 'security-compliance/terms-of-service',
        },
        {
          title: 'Screening providers',
          url: DOCS + 'security-compliance/risk-and-compliance',
        },
        {
          title: 'Any account can be locked by DAO or locker role',
          url: INTENTS + 'defuse/src/contract/accounts/force.rs#L21-L33',
        },
        {
          title: 'Owner-only mint of the wrapped Ethereum assets',
          url: INTENTS + 'poa-token/src/contract.rs#L79-L81',
        },
        {
          title:
            'Zodl sends its partner key and refund address with each quote',
          url:
            ZODL + 'Dependencies/SwapAndPay/sources/Near1Click.swift#L313-L344',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        "Every payout address is public on NEAR and in the bridge's decryptable payout note, and all of an account's rotated addresses share one incoming viewing key on the Pallas curve. A quantum computer recovers that key from any one address and then decrypts every note the account ever received, including the change notes of its exits, which joins both legs of every round trip. Ironwood's quantum-recoverable notes protect funds, not privacy.",
      advice:
        'Use a separate Zodl account per round trip, so that one recovered key exposes only that trip.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Spends are found through the change notes they pay back to the same account.',
        },
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Orchard key agreement on the Pallas curve',
          url: 'https://zips.z.cash/protocol/protocol.pdf#concreteorchardkeyagreement',
        },
        {
          title: 'ZIP 2005: quantum recoverability, not quantum privacy',
          url: 'https://zips.z.cash/zip-2005',
        },
        {
          title: 'Payouts are encrypted to an all-zero outgoing viewing key',
          url: BRIDGE + 'zcash_utils/orchard_policy.rs#L13-L63',
        },
      ],
    },
  },
})
