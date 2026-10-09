import { definePrivacyAdversaries } from '../../common/privacyAdversaries'
import type { PrivacyFieldExposure } from '../../types'

const INTENTS =
  'https://github.com/near/intents/blob/fa44ede9e874931c39a6c4246de82bc40f4f8d99/'
const BRIDGE =
  'https://github.com/Near-One/btc-bridge/blob/4711c2f1d035a208464b9729bb24e45ed9ab7831/contracts/satoshi-bridge/src/'
const ZODL =
  'https://github.com/zodl-inc/zodl-ios/blob/75b83d7601573e165e2dacdfaffb69750dadd05f/secant/Sources/'
const ZODL_SDK =
  'https://github.com/zodl-inc/zodl-swift-wallet-sdk/blob/191d0347186a1c6fcd207eead24a891049444041/Sources/ZcashLightClientKit/'
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
          note: 'Only ZEC exists inside the pool. The assets swapped from and to are public on NEAR.',
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
          title: 'Zodl creates a fresh shielded address for every quote',
          url: ZODL + 'Features/SwapAndPayForm/SwapAndPayStore.swift#L908-L955',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposureShort:
        'Payouts into the pool and later deposits to the bridge are public with amount and time, so a round trip of similar size pairs them.',
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
      exposureShort:
        "Each sync sends the lightwalletd server your account's transparent addresses outside Tor, so timing ties both the payout fetch and the exit to you.",
      exposureContinued:
        "Zodl's Tor isolates each 1Click request, payout fetch and transaction, while block sync and these address lookups stay direct.",
      advice:
        'Turn on Tor in Zodl and point it at a lightwalletd server you run.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Private only with Tor on and your own lightwalletd server.',
        },
      },
      sources: [
        {
          title: 'Tor is off unless the user enables it',
          url:
            ZODL + 'Dependencies/SDKSynchronizer/SDKSynchronizerLive.swift#L45',
        },
        {
          title:
            "Every sync looks up the account's transparent addresses directly",
          url:
            ZODL_SDK + 'Block/FetchUnspentTxOutputs/UTXOFetcher.swift#L39-L52',
        },
        {
          title: 'Each transaction fetch and send gets its own Tor connection',
          url: ZODL_SDK + 'Modules/Service/LightWalletService.swift#L146-L159',
        },
        {
          title: 'Compact blocks download over a direct connection',
          url: ZODL_SDK + 'Block/Download/BlockDownloader.swift#L187',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        'The operator custodies both legs in transit and can freeze any account or deposit, so it sets the terms on which your funds come back.',
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
          title: '1Click terms: IP and wallet data, screening, custody',
          url: DOCS + 'security-compliance/terms-of-service',
        },
        {
          title: 'Any account can be locked by the multisig or a locker',
          url: INTENTS + 'defuse/src/contract/accounts/force.rs#L21-L33',
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
        "All of an account's rotated addresses share one incoming viewing key on the Pallas curve, and every payout address is public on NEAR.",
      exposureContinued:
        "Whoever breaks elliptic-curve cryptography recovers that key from any one address and decrypts every note the account ever received. Those include the change notes of its exits, which join both legs of every round trip. ZIP 2005's quantum recoverability protects only funds.",
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
          url: BRIDGE + 'zcash_utils/orchard_policy.rs#L13-L63',
        },
      ],
    },
  },
})
