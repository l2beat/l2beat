import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import {
  PRIVACY_EXIT_WINDOW,
  PRIVACY_REPRODUCIBILITY,
} from '../../common/privacySummaryValues'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { moneroCakeWalletAdversaries } from './adversaries'
import { moneroCakeWalletRiskSummary } from './riskSummary'

export const moneroCakeWallet: BaseProject = {
  id: ProjectId('monero-cake-wallet'),
  slug: 'monero-cake-wallet',
  name: 'Monero via Cake Wallet',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-09-24')),
  statuses: {
    yellowWarning:
      'This route has no Ethereum contracts. Real-time monitoring is not supported.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "A shielded ledger round trip: Cake Wallet's swap screen moves Ethereum funds into Monero and back, handing each leg to a centralized instant exchange.",
    detailedDescription: readProjectMarkdown(
      'monero-cake-wallet',
      'detailedDescription',
    ),
    links: {
      websites: ['https://cakewallet.com', 'https://www.getmonero.org'],
      documentation: [
        'https://docs.cakewallet.com/features/basic/swap',
        'https://docs.cakewallet.com/support/swap',
        'https://docs.cakewallet.com/features/privacy-and-security/privacy-settings',
        'https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf',
      ],
      explorers: [],
      repositories: [
        'https://github.com/cake-tech/cake_wallet',
        'https://github.com/monero-project/monero',
      ],
      socialMedia: ['https://x.com/cakewallet', 'https://x.com/monero'],
      other: [
        'https://github.com/cake-tech/cake_wallet/blob/ae2765659afce6b353d20504830b81198b2fc5e2/PRIVACY.md',
        'https://changenow.io/faq/kyc-aml',
        'https://kycnot.me/service/trocador',
      ],
    },
    badges: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: {
      name: 'Cake Wallet',
      url: 'https://cakewallet.com',
      since: '2026-09-29',
      delivery: {
        type: 'pinned',
        pin: {
          type: 'sha256',
          file: 'Cake_Wallet_v6.5.4-arm64-v8a.apk',
          hash: 'f9eee98888b432df7069e8756b8a6655767e467dfb2f7f5ebb4fa0b90d4cd2b4',
        },
      },
      version: '6.5.4',
      source: {
        repository: 'https://github.com/cake-tech/cake_wallet',
        commit: 'ae2765659afce6b353d20504830b81198b2fc5e2',
      },
      checkedApps: [
        {
          name: 'Unstoppable Wallet',
          icon: 'unstoppable',
          finding:
            "Routes every swap through Unstoppable's own server, which records each leg's payout and refund addresses and deposit transaction hash.",
          fix: 'Request quotes and create orders with each swap service directly.',
          source:
            'https://github.com/horizontalsystems/unstoppable-wallet-android/blob/d6661c8d0dc02d259767f58b7cd73cabb877da18/walletkit/src/main/java/io/horizontalsystems/walletkit/modules/multiswap/providers/USwapProvider.kt#L1375-L1399',
        },
        {
          name: 'Coin Wallet',
          icon: 'coin-wallet',
          finding:
            "Creates every swap on Coin Wallet's server, signed by the wallet's device key, so Coin Wallet can link the deposit and exit addresses.",
          fix: 'Create swap orders with each service directly, without the device key.',
          source:
            'https://github.com/CoinSpace/CoinSpace/blob/d2dff4227d37e33d22856b57e9e50bf8689d8f34/web/src/lib/exchanges/BaseExchange.js#L167-L181',
        },
        {
          name: 'Stack Wallet',
          icon: 'stack-wallet',
          finding:
            "Its built-in Tor skips Ethereum, so Stack's Ethereum node gets every balance lookup with the user's IP.",
          fix: 'Route the Ethereum client through the built-in Tor, like its other coins.',
          source:
            'https://github.com/cypherstack/stack_wallet/blob/7ce7b34f260f7bb481ee50e2ebebebfb42c2ed1c/lib/wallets/wallet/impl/ethereum_wallet.dart#L144-L151',
        },
        {
          name: 'Edge',
          icon: 'edge-wallet',
          finding:
            "Its Nym mixnet setting covers wallet sync only, so swap services get the payout and refund addresses with the user's IP.",
          fix: 'Send swap quotes and orders through the mixnet when it is on.',
          source:
            'https://github.com/EdgeApp/edge-exchange-plugins/blob/95cc660b865e36528083959816856f790471a86b/src/swap/central/changenow.ts#L196-L215',
        },
        {
          name: 'Atomic Wallet',
          icon: 'atomic-wallet',
          finding:
            "Has no Tor or proxy option, so Atomic's servers get the user's IP with every wallet address they sync.",
          fix: 'Add built-in Tor that carries every request.',
          source: 'https://atomicwallet.io/downloads',
          checked: '2026-10-27',
        },
      ],
    },
    trackedOn: ['ethereum'],
    tokens: [],
    anonymitySet: {
      type: 'not-applicable',
      description:
        'Each Monero spend hides among the 16 members of its ring, and each self-transfer multiplies the candidates by about 30.',
    },
    exitWindow: {
      ...PRIVACY_EXIT_WINDOW.none,
      description:
        'Funds in transit sit with the swap service, which can steal them.',
      walkawayTest: {
        passed: false,
        reason:
          'Deposit and payout both depend on the swap service. If it stops, funds in transit are lost or refunded at its discretion.',
      },
    },
    reproducibility: {
      ...PRIVACY_REPRODUCIBILITY.partial,
      description:
        'Cake Wallet and Monero are open source, but Cake states that its release builds do not reproduce from that source. The swap services run closed systems.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.bridged,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: moneroCakeWalletAdversaries,
    compliance: {
      short:
        'Each swap service screens on its own and can hold a deposit until the user identifies themselves.',
      enforcedBy: 'operator',
      enforcedByNote: "meaning each swap service while it holds a swap's funds",
      check: {
        rules: 'closed',
        detail:
          'Each swap service screens by its own rules, which only its own policy describes.',
      },
      when: 'everyUse',
      cost: {
        loses: 'funds',
        detail:
          "A service that holds a deposit keeps it until the user passes its checks or it refunds. XMR that reached the wallet is out of every service's reach.",
      },
      disclosure: 'each swap service, for the swaps it handled',
      cleanOrigin: {
        tool: 'payment',
        detail:
          'The wallet shows a transaction key per payment and a private view key for all incoming ones.',
      },
      content: readProjectMarkdown('monero-cake-wallet', 'compliance'),
    },
    riskSummary: moneroCakeWalletRiskSummary,
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'monero-cake-wallet',
        'upgradesAndGovernance',
      ),
    },
  },
}
