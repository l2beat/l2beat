import { definePrivacyAdversaries } from '../../common/privacyAdversaries'
import type { PrivacyFieldExposure } from '../../types'

const INTENTS =
  'https://github.com/near/intents/blob/fa44ede9e874931c39a6c4246de82bc40f4f8d99/'
const BRIDGE =
  'https://github.com/Near-One/btc-bridge/blob/66d239120981ba58ae92f73dc6860e0369b4ad28/contracts/satoshi-bridge/src/'
const ZODL =
  'https://github.com/zodl-inc/zodl-ios/blob/75b83d7601573e165e2dacdfaffb69750dadd05f/secant/Sources/'
const ZODL_SDK =
  'https://github.com/zodl-inc/zodl-swift-wallet-sdk/blob/191d0347186a1c6fcd207eead24a891049444041/Sources/ZcashLightClientKit/'
// The sync engine Zodl 3.15.0 ships, through SDK 5.0.0 (zodl-slipstream 0.2.0).
const SLIPSTREAM =
  'https://github.com/zodl-inc/slipstream/blob/3bd434ce6023a000cc377634d8cd2b184161857a/core/src/'
const DOCS = 'https://docs.near-intents.org/'

const PAYOUT_RECIPIENT: PrivacyFieldExposure = {
  verdict: 'atRisk',
  note: 'Payout notes are decryptable by anyone, so a reused address ties payouts together.',
}

export const zcashNearIntentsAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: "Hides which funds leaving Ethereum come back as which, by passing through Zcash's shielded pool. Everything on Ethereum and NEAR is public.",
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        "Zcash's shielded pool hides which payout into it funds which later exit.",
      exposureContinued:
        'Everything up to the pool edge is public: the Ethereum deposit and the NEAR entries that credit, swap and withdraw it. The bridge encrypts each payout so that anyone can decrypt its Zcash address and amount.',
      interior: {
        sender: 'private',
        recipient: PAYOUT_RECIPIENT,
        amount: 'private',
        asset: {
          verdict: 'exposed',
          note: 'Only ZEC exists inside the pool, and the assets swapped from and to are public on NEAR.',
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
          url: BRIDGE + 'api/token_receiver.rs#L12-L18',
        },
        {
          title: 'Payouts are encrypted to an all-zero outgoing viewing key',
          url: BRIDGE + 'zcash_utils/orchard_policy.rs#L11-L64',
        },
        {
          title: 'Zodl creates a fresh shielded address for every quote',
          url: ZODL + 'Features/SwapAndPayForm/SwapAndPayStore.swift#L908-L955',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposureShort:
        'Only the amount and timing of a round trip can pair a payout into the pool with a later deposit to the bridge.',
      exposureContinued:
        'Deposit addresses are fresh per quote and spent together with the bridge change address, which marks every exit as NEAR Intents.',
      advice:
        'Hold the ZEC in the pool for days, split or merge it with other shielded funds, and swap back amounts that match no payout.',
      interior: {
        sender: 'private',
        recipient: PAYOUT_RECIPIENT,
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Round-trip amount and timing across the pool edge pair a payout with a later deposit.',
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
          url: BRIDGE + 'deposit_msg.rs#L50-L53',
        },
        {
          title: 'Bridge change address and UTXO set',
          url: 'https://nearblocks.io/address/zcash-connector.bridge.near',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        "Each sync sends the account's transparent addresses to lightwalletd before fetching its transactions, so lightwalletd can tie the payout and the exit to the account.",
      exposureContinued:
        "With Tor on, each 1Click request and each sent transaction gets its own circuit, and sync lookups go over Tor while blocks download directly. Tor hides the user's IP from the lookups, not the addresses they name.",
      advice:
        'Turn on Tor in Zodl and point it at a lightwalletd server the user runs.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: "Private only with Tor on and the user's own lightwalletd server.",
        },
      },
      sources: [
        {
          title: 'Zodl syncs with the Slipstream engine',
          url: ZODL + 'Models/WalletConfig.swift#L14-L25',
        },
        {
          title:
            "Each sync opens one connection and looks up the account's transparent addresses first",
          url: SLIPSTREAM + 'engine.rs#L246-L282',
        },
        {
          title:
            'Blocks download directly, lookups go over isolated Tor circuits',
          url: SLIPSTREAM + 'connector.rs#L17-L22',
        },
        {
          title: 'Each sent transaction gets its own Tor circuit',
          url: ZODL_SDK + 'Transaction/EndpointSubmitter.swift#L26-L41',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        "The operator custodies both legs in transit and can freeze any account or deposit, setting the terms on which the user's funds return.",
      exposureContinued:
        'Over Tor, its 1Click API sees each leg only as NEAR publishes it, with a fresh shielded address per swap. It holds no key into the shielded pool.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'The operator can freeze either leg and set the terms of its release.',
        },
      },
      sources: [
        {
          title:
            '1Click terms: IP and wallet data, screening, custody (2026-10-30)',
          url: DOCS + 'security-compliance/terms-of-service',
        },
        {
          title: 'Any account can be locked by the multisig or a locker',
          url: INTENTS + 'defuse/src/contract/accounts/force.rs#L19-L33',
        },
        {
          title: 'Owner-only mint of the wrapped Ethereum assets',
          url: INTENTS + 'poa-token/src/contract.rs#L79-L81',
        },
        {
          title:
            'Zodl sends its partner key and a fresh refund address with each quote',
          url:
            ZODL + 'Dependencies/SwapAndPay/sources/Near1Click.swift#L313-L352',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        "Whoever breaks elliptic-curve cryptography recovers an account's incoming viewing key from any of its payout addresses, which are public on NEAR.",
      exposureContinued:
        "All of the account's rotated addresses share that key, so it decrypts every note the account ever received. Those include the change notes of its exits, which join both legs of every round trip. ZIP 2005's quantum recoverability protects only funds.",
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
          title: 'ZIP 2005: quantum recoverability of funds',
          url: 'https://zips.z.cash/zip-2005',
        },
        {
          title: 'Payouts are encrypted to an all-zero outgoing viewing key',
          url: BRIDGE + 'zcash_utils/orchard_policy.rs#L11-L64',
        },
      ],
    },
  },
})
