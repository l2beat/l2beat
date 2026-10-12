import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const CAKE =
  'https://github.com/cake-tech/cake_wallet/blob/7ce3cd75c3fd0c0add1cead41038ab8806ffebde/'
const MONERO = 'https://github.com/monero-project/monero/blob/v0.18.5.1/'

export const moneroCakeWalletAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which funds leaving Ethereum come back as which, by passing them through Monero between two custodial swaps. Both Ethereum legs are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'The Monero transactions between the deposit into a swap service and the payout from its hot wallet hide sender, recipient and amount.',
      exposureContinued: S.entryExitPublic('Both Ethereum transfers'),
      advice:
        'Exit to a new in-app Ethereum wallet made with Create New Recovery Phrase.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: {
          verdict: 'exposed',
          note: 'Only XMR exists inside. The source asset is public on Ethereum.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'An EVM wallet in Cake has one address, so exiting to the wallet that deposited pays the address that deposited.',
        },
      },
      sources: [
        {
          title:
            'The deposit is a plain transfer from the wallet to the address the service returned',
          url:
            CAKE +
            'lib/view_model/exchange/exchange_trade_view_model.dart#L200-L206',
        },
        {
          title: 'An EVM wallet has a single address',
          url: CAKE + 'cw_evm/lib/evm_chain_wallet_addresses.dart#L11-L38',
        },
        {
          title: 'Every input names 16 ring members',
          url: MONERO + 'src/cryptonote_core/blockchain.cpp#L3268',
        },
        {
          title: 'Amounts are encrypted to the recipient',
          url: MONERO + 'src/ringct/rctOps.cpp#L672-L720',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposureShort:
        'Only amount and timing can pair a deposit into a swap service with a payout from a hot wallet serving every asset the service trades.',
      advice: `${S.commonAmounts} ${S.freshExit}`,
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'A round trip of similar amount and timing pairs the two Ethereum legs.',
        },
      },
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        'Built-in Tor sends every call over one shared circuit for up to ten minutes, so only separate app sessions keep the legs apart.',
      exposureContinued:
        'Moralis receives every Ethereum wallet the app opens, so deposit and exit wallets kept in the app pair up whenever both open close together.',
      advice:
        'Turn on built-in Tor and restart the app, since the Ethereum client keeps the connection it started with. After the entry, delete the deposit wallet from Cake and restart, so later sessions only see the exit wallet.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Private only over built-in Tor, with each leg in its own app session.',
        },
      },
      sources: [
        {
          title: 'Built-in Tor is off unless the user enables it',
          url: CAKE + 'lib/store/settings_store.dart#L1590',
        },
        {
          title:
            'Opening a wallet connects its node and sends its address to Moralis',
          url: CAKE + 'lib/reactions/on_current_wallet_change.dart#L94-L113',
        },
        {
          title: 'Embedded Tor config: one SocksPort, no isolation flags',
          url: CAKE + 'cw_core/lib/utils/tor/torch.dart#L65-L70',
        },
        {
          title: 'The Ethereum client binds its proxy setting once',
          url: CAKE + 'cw_evm/lib/clients/evm_chain_client.dart#L24',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        'Each swap service custodies its leg and can hold the funds until you pass identity checks, and identities on both legs link them.',
      exposureContinued:
        'The entry service knows the XMR output it paid you, and the exit service sees the rings of the transaction that pays it. Together they find that output in the rings behind the exit, and self-transfers only widen the search.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: "Rings that reference the service's payout output point to the spend of your XMR.",
        },
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'A service can hold either leg until you identify yourself.',
        },
      },
      sources: [
        {
          title:
            'Breaking Monero: poisoned outputs, the attack by a counterparty on both sides',
          url: 'https://www.monerooutreach.org/breaking-monero/poisoned-outputs.html',
        },
        {
          title:
            'ChangeNOW: automated AML holds, KYC through SumSub, refund minus fees',
          url: 'https://changenow.io/faq/kyc-aml',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'Whoever breaks elliptic-curve cryptography recovers every Monero output key from public chain data, so every ring shows its real spend.',
      exposureContinued:
        "A known address also yields its view key, and anyone learns a service's address by starting a trade. Your XMR can then be followed from the entry service to the exit service, where amounts and timing pair it with both Ethereum legs.",
      interior: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: 'Readable for outputs to known addresses, and the services know yours.',
        },
        amount: {
          verdict: 'atRisk',
          note: 'Readable for outputs to known addresses.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title:
            'A key image is the output key hashed to a point times its private key',
          url: MONERO + 'src/crypto/crypto.cpp#L621-L628',
        },
        {
          title:
            'Zero to Monero: one-time addresses, amount encryption and key images (chapters 4 to 6)',
          url: 'https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf',
        },
      ],
    },
  },
})
