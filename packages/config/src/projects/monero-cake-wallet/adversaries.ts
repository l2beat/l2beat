import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const CAKE =
  'https://github.com/cake-tech/cake_wallet/blob/b7247dd0969d9004e49ce592b855cff2c7706fd6/'
const MONERO = 'https://github.com/monero-project/monero/blob/v0.18.5.1/'
const WALLET2 =
  'https://github.com/monero-project/monero/blob/dbcc7d212c094bd1a45f7291dbb99a4b4627a96d/src/wallet/wallet2.cpp'

export const moneroCakeWalletAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which funds leaving Ethereum come back as which, by passing through Monero via custodial swap services. The entry swap service sees both ends of its leg, the exit service sees the Ethereum exit but not where the XMR came from.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposure:
        'Both Ethereum legs are public: your deposit to a swap-service address, and later a payout from a service hot wallet to your exit address. Inside Monero nothing is visible, so nothing ties entry to exit. Cake Wallet persists one address per EVM wallet, which thus cannot be reused for link privacy.',
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
          note: 'Exiting to the same in-app EVM wallet pays the very address that deposited.',
        },
      },
      sources: [
        {
          title:
            'The deposit is a plain transfer from the wallet to the address the service returned',
          url:
            CAKE +
            'lib/view_model/exchange/exchange_trade_view_model.dart#L199-L206',
        },
        {
          title: 'Monero stealth addresses hide the recipient',
          url: 'https://www.getmonero.org/resources/moneropedia/stealthaddress.html',
        },
        {
          title: 'RingCT hides the amount',
          url: 'https://www.getmonero.org/resources/moneropedia/ringCT.html',
        },
        {
          title: 'Consensus requires 16 ring members per input since fork 15',
          url: MONERO + 'src/cryptonote_core/blockchain.cpp#L3268',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Entry and exit are both filed as swap-service transfers with amount and time, so a round trip of similar size within hours pairs them. Monero offers nothing to correlate.',
      advice: 'Wait weeks, split the XMR, and exit amounts that are common.',
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
      sources: [
        {
          title:
            'Möser et al., An Empirical Analysis of Traceability in the Monero Blockchain',
          url: 'https://arxiv.org/abs/1704.04299',
        },
        {
          title: 'Outputs are spendable ten blocks after they are mined',
          url: MONERO + 'src/cryptonote_config.h#L49',
        },
        {
          title:
            'Hard fork table: the chain runs version 16 rules since block 2689608',
          url: MONERO + 'src/hardforks/hardforks.cpp#L75',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      exposure:
        "Tor is off by default. On each leg the swap API sees your IP with both addresses. Blink gets the signed deposit, Etherscan, Moralis and the RPC get your Ethereum address, and Cake's Monero node gets your IP, restore height and broadcasts, but not your outputs. With Tor on, calls within ten minutes share a circuit/identity because Tor sessions are not isolated. Legs in separate app sessions days apart are unlinkable by any network observer.",
      advice:
        "Turn on Tor before the first quote and set Swap to 'Tor only'. Switch off Blink and Etherscan, use your own nodes, restart the app between legs, and never open the entry and exit Ethereum wallets in the same session.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Swap API, Blink relay and RPC see the same IP, or exit, with deposit and payout address.',
        },
      },
      sources: [
        {
          title: 'Built-in Tor is off unless the user enables it',
          url: CAKE + 'lib/store/settings_store.dart#L1561',
        },
        {
          title: 'Requests go through Tor only when built-in Tor is running',
          url: CAKE + 'cw_core/lib/utils/proxy_wrapper.dart#L147-L185',
        },
        {
          title:
            'Embedded Tor config: one SocksPort, no isolation flags, no control port',
          url: CAKE + 'cw_core/lib/utils/tor/torch.dart#L65-L70',
        },
        {
          title: 'All requests use the same SOCKS proxy without credentials',
          url: CAKE + 'cw_core/lib/utils/proxy_wrapper.dart#L76-L80',
        },
        {
          title: 'The Monero wallet uses the same SOCKS port for its node',
          url: CAKE + 'cw_monero/lib/monero_wallet.dart#L228-L245',
        },
        {
          title:
            'Tor manual: IsolateDestAddr and IsolateDestPort are off by default, MaxCircuitDirtiness is 10 minutes',
          url: 'https://2019.www.torproject.org/docs/tor-manual.html.en',
        },
        {
          title:
            "'Tor only' keeps only providers with an onion endpoint, which is Trocador",
          url:
            CAKE +
            'lib/view_model/exchange/exchange_view_model.dart#L1678-L1683',
        },
        {
          title: 'Trade status is polled every 20 seconds on the trade screen',
          url:
            CAKE +
            'lib/view_model/exchange/exchange_trade_view_model.dart#L102',
        },
        {
          title: 'Background trade monitor: every 5 minutes for up to 24 hours',
          url: CAKE + 'lib/core/trade_monitor.dart#L27-L28',
        },
        {
          title:
            'Ethereum and Base transactions are sent to the Blink Labs mempool first, on by default',
          url: CAKE + 'cw_evm/lib/clients/evm_chain_client.dart#L460-L478',
        },
        {
          title: 'Blink protection default and supported chains',
          url: CAKE + 'lib/store/settings_store.dart#L1333',
        },
        {
          title:
            'Transaction history is fetched from the Etherscan API, on by default',
          url: CAKE + 'cw_evm/lib/clients/evm_chain_client.dart#L43',
        },
        {
          title:
            'Token discovery sends the wallet address to Moralis on every wallet switch',
          url: CAKE + 'lib/reactions/on_current_wallet_change.dart#L112',
        },
        {
          title: 'Default Ethereum RPC and Monero node',
          url: CAKE + 'lib/entities/default_settings_migration.dart#L34-L43',
        },
        {
          title:
            "Cake's default Monero node: restricted RPC over TLS, flagged trusted in the app",
          url: CAKE + 'assets/node_list.yml#L1-L8',
        },
        {
          title:
            'The Monero wallet downloads every block from its restore height and scans locally',
          url: WALLET2 + '#L3181-L3197',
        },
        {
          title: 'Cake Labs privacy policy: what its nodes receive',
          url: 'https://github.com/cake-tech/cake_wallet/blob/main/PRIVACY.md',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "The entry service holds your Ethereum refund and Monero payout address, the exit service your Ethereum exit address, plus amounts and Cake's key. On exit it also gets a fresh refund subaddress, unlinkable to the rest of your wallet, and sees only the 16-member ring of the incoming transaction, not its origin. One service, or Trocador, on both legs holds the full round trip. Two services can still find it, since the entry service can scan public rings for spends of its own payout output and a shared vendor joins that to the exit. Services screen, hold until KYC and refund minus fees. Cake Labs holds no keys, but its default node supplies the decoy distribution.",
      advice:
        'Use different services for entry and exit, paste a fresh subaddress on entry, exit to a fresh Ethereum wallet, and do not pay the exit service straight from the entry payout output.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title:
            'Exit leg: the refund address is a fresh subaddress, hidden afterwards',
          url:
            CAKE +
            'lib/view_model/exchange/exchange_view_model.dart#L1347-L1351',
        },
        {
          title: 'Exit picker lists every in-app wallet of the receive type',
          url:
            CAKE + 'lib/view_model/exchange/exchange_view_model.dart#L434-L446',
        },
        {
          title:
            'The refund address sent to the service is the Ethereum wallet address',
          url:
            CAKE +
            'lib/view_model/exchange/exchange_view_model.dart#L1239-L1247',
        },
        {
          title:
            "Picking an in-app wallet uses the wallet's stored address as payout address",
          url:
            CAKE +
            'lib/new-ui/widgets/swap_page/swap_address_selection_modal.dart#L265',
        },
        {
          title:
            'The stored Monero address is the primary subaddress, the fresh-subaddress routine only serves the open wallet',
          url: CAKE + 'cw_monero/lib/monero_wallet_addresses.dart#L33-L62',
        },
        {
          title:
            'The current Monero address is set to the first, primary, subaddress',
          url: CAKE + 'cw_monero/lib/monero_wallet_addresses.dart#L131-L136',
        },
        {
          title: 'An EVM wallet has a single address',
          url: CAKE + 'cw_evm/lib/evm_chain_wallet_addresses.dart#L12-L33',
        },
        {
          title:
            'Trocador is asked for partners of KYC grade C or better and both addresses are forwarded',
          url:
            CAKE +
            'lib/exchange/provider/trocador_exchange_provider.dart#L224-L240',
        },
        {
          title:
            'Cake ships API keys, markups and affiliate IDs with each provider',
          url: CAKE + 'tool/utils/secret_key.dart#L15-L105',
        },
        {
          title:
            'ChangeNOW: automated AML holds, KYC through SumSub, refund minus fees',
          url: 'https://changenow.io/faq/kyc-aml',
        },
        {
          title: 'Trocador KYC grades, with a grade C partner as example',
          url: 'https://kycnot.me/service/trocador',
        },
        {
          title:
            'Decoys are drawn from the node-supplied output distribution, which is only sanity-checked',
          url: WALLET2 + '#L9276-L9288',
        },
        {
          title:
            'MRL-0001: chain reactions from outputs the adversary already knows',
          url: 'https://www.getmonero.org/resources/research-lab/pubs/MRL-0001.pdf',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'Monero rests on ed25519 discrete logs. A quantum computer recovers each transaction key from the chain, and the services know your payout and refund addresses, so the payout, its amount and every spend up to the exit become readable.',
      advice: 'Treat the swap as linkable in the long run.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title:
            'Zero to Monero: one-time addresses, amount encryption and key images (chapters 4 to 6)',
          url: 'https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf',
        },
        {
          title: 'Monero CCS: research post-quantum strategies for Monero',
          url: 'https://ccs.getmonero.org/proposals/research-post-quantum-monero.html',
        },
        {
          title:
            'Hard fork table: no post-quantum or FCMP++ rules are active on mainnet',
          url: MONERO + 'src/hardforks/hardforks.cpp#L60-L76',
        },
      ],
    },
  },
})
