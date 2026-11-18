import {
  ADVICE_SNIPPETS as A,
  definePrivacyAdversaries,
} from '../../common/privacyAdversaries'
import type { PrivacyFieldExposure } from '../../types'

const INTENTS =
  'https://github.com/near/intents/blob/fa44ede9e874931c39a6c4246de82bc40f4f8d99/'
const BRIDGE =
  'https://github.com/Near-One/btc-bridge/blob/66d239120981ba58ae92f73dc6860e0369b4ad28/contracts/satoshi-bridge/src/'
const VIZOR =
  'https://github.com/chainapsis/vizor-wallet/blob/43c1b3467fc00c630fcd7eb8e8070b8b4d409596/'
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
          title: 'Vizor creates a fresh shielded address for every quote',
          url:
            VIZOR +
            'lib/src/features/swap/providers/swap_zec_staging_address_service.dart#L58-L67',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposureShort:
        'Only the amount and timing of a round trip can pair a payout into the pool with a later deposit to the bridge.',
      exposureContinued:
        'Deposit addresses are fresh per quote and spent together with the bridge change address, which marks every exit as NEAR Intents.',
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
        "Private queries show Valar's PIR server the block ranges where the wallet has activity, which can tie its payout and exit together.",
      exposureContinued:
        "With Tor and Private queries on, lightwalletd receives no address or transaction id of the account. By default both are off, and lightwalletd gets the transparent addresses with the user's IP.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: "Valar's PIR server sees the wallet's active block ranges, and lightwalletd its addresses unless Tor and Private queries are on.",
        },
      },
      sources: [
        {
          title: 'Private queries keep transparent lookups from lightwalletd',
          url:
            VIZOR +
            'rust/src/wallet/sync_engine/enhancement/README.md#L335-L347',
        },
        {
          title: 'Each PIR request takes its own Tor circuit',
          url:
            VIZOR +
            'rust/src/wallet/sync_engine/enhancement/transport/mod.rs#L175-L176',
        },
        {
          title: 'PIR leaks: active block ranges and status timing',
          url: 'https://github.com/zakura-core/wallet-libraries/blob/0074b990a635a3e53258c298ad976043a8d42c3e/docs/pir-remaining-leaks-plan.md#L22-L36',
        },
        {
          title: 'Tor is off by default',
          url:
            VIZOR + 'lib/src/providers/network_privacy_provider.dart#L92-L95',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        "The operator custodies both legs in transit and can freeze any account or deposit, setting the terms on which the user's funds return.",
      exposureContinued:
        "Its 1Click API gets each call through Vizor's server and sees each leg only as NEAR publishes it, with a fresh shielded address per swap. It holds no key into the shielded pool.",
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
            "1Click calls go through Vizor's server, which adds its referral",
          url:
            VIZOR +
            'lib/src/features/swap/providers/swap_provider_config.dart#L6-L15',
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
  advice: [
    {
      name: 'Set up',
      text: 'Turn on Tor and Private queries in Vizor before its first sync.',
      against: ['networkObserver'],
    },
    {
      name: 'Hold',
      text: 'Hold the ZEC in the pool for days, and split or merge it with other shielded funds.',
      against: ['chainAnalyst'],
    },
    {
      name: 'Swap back',
      text: `Swap back amounts that match no payout. ${A.freshAddress}`,
      against: ['chainAnalyst'],
    },
  ],
})
