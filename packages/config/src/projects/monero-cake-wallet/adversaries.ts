import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const CAKE =
  'https://github.com/cake-tech/cake_wallet/blob/b7247dd0969d9004e49ce592b855cff2c7706fd6/'
const MONERO = 'https://github.com/monero-project/monero/blob/v0.18.5.1/'

export const moneroCakeWalletAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which funds leaving Ethereum come back as which, by passing them through Monero between two custodial swaps. Both Ethereum legs are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      shortDescription:
        'Nothing public ties the deposit into a swap service to the later payout from a service hot wallet, because the Monero transactions in between hide sender, recipient and amount.',
      longDescription: S.entryExitPublic('Both Ethereum transfers'),
      advice:
        'Exit to a new in-app Ethereum wallet created from a fresh seed, never the wallet that deposited.',
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
      shortDescription:
        'Only amount and timing can pair the two Ethereum legs: a deposit into a swap service and a payout from a hot wallet that serves every asset the service trades.',
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
      sentiment: 'bad',
      shortDescription:
        "Cake's Tor has one SOCKS port without isolation, so Moralis, which cannot be switched off, and Blink and Etherscan, if left on, can see both Ethereum wallets on one circuit.",
      longDescription:
        'With Tor and own nodes, the two legs stay apart unless they run in the same app/tor session.',
      advice:
        'Turn on Tor, switch off Blink and Etherscan, set your own Monero node and Ethereum RPC, then restart the app, since the Ethereum client keeps its first connection. Wait and restart it again between the legs.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Ethereum wallets opened in one session share a Tor circuit toward Moralis.',
        },
      },
      sources: [
        {
          title: 'Built-in Tor is off unless the user enables it',
          url: CAKE + 'lib/store/settings_store.dart#L1561',
        },
        {
          title:
            'Embedded Tor config: one SocksPort, no isolation flags, no control port',
          url: CAKE + 'cw_core/lib/utils/tor/torch.dart#L65-L70',
        },
        {
          title: 'The Ethereum client binds its proxy setting once',
          url: CAKE + 'cw_evm/lib/clients/evm_chain_client.dart#L24',
        },
        {
          title:
            'Every wallet switch sends the address to Moralis, gated only by the API key',
          url: CAKE + 'cw_evm/lib/clients/evm_chain_client.dart#L615-L640',
        },
        {
          title: 'Blink and Etherscan toggles under Connections',
          url:
            CAKE + 'lib/src/screens/settings/connection_sync_page.dart#L64-L79',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      shortDescription:
        'The swap-in service that pays your XMR knows that output, and the service you exit with sees the rings of your Monero transaction.',
      longDescription:
        "One party holding both finds its output in the rings behind the exit. Each service also holds the addresses, amounts, IP and Cake's API key of its leg, screens them and can hold the funds until KYC.",
      advice:
        'Force different services for entry and exit. Self-transfer the XMR several times, hours to days apart, and never pay the exit service the whole amount.',
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
          note: 'Private only if no party holds the records of both legs.',
        },
      },
      sources: [
        {
          title:
            'Breaking Monero: poisoned outputs, the attack by a counterparty on both sides',
          url: 'https://www.monerooutreach.org/breaking-monero/poisoned-outputs.html',
        },
        {
          title: 'The user can force a provider, otherwise the best rate wins',
          url:
            CAKE + 'lib/view_model/exchange/exchange_view_model.dart#L596-L603',
        },
        {
          title:
            'Trocador is asked for partners of KYC grade C or better and both addresses are forwarded',
          url:
            CAKE +
            'lib/exchange/provider/trocador_exchange_provider.dart#L226-L240',
        },
        {
          title: 'Cake ships its API key with the providers',
          url: CAKE + 'tool/utils/secret_key.dart#L15-L106',
        },
        {
          title:
            'ChangeNOW: automated AML holds, KYC through SumSub, refund minus fees',
          url: 'https://changenow.io/faq/kyc-aml',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      shortDescription:
        "A quantum computer recovers the key of every ring member from the chain alone, recomputes its key image and so finds the real spend of every ring, which turns the XMR's path from payout to exit into a public trail.",
      longDescription:
        "The services' records of payout and deposit then join the Ethereum legs.",
      interior: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: 'Readable for every output to an address the attacker knows, as the services know yours.',
        },
        amount: {
          verdict: 'atRisk',
          note: 'Readable for every output to an address the attacker knows.',
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
