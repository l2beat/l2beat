import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { moneroCakeWalletAdversaries } from './adversaries'

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
        'https://github.com/cake-tech/cake_wallet/blob/main/PRIVACY.md',
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
      version: '6.4.6',
      source: {
        repository: 'https://github.com/cake-tech/cake_wallet',
        commit: '7ce3cd75c3fd0c0add1cead41038ab8806ffebde',
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
            'https://github.com/cypherstack/stack_wallet/blob/f920c360f999a183e8faf01a3188f1199f316df5/lib/wallets/wallet/impl/ethereum_wallet.dart#L53-L60',
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
          fix: 'Add built-in Tor that carries every request, swaps included.',
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
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'Funds in transit sit with the swap service, which can steal them.',
      walkawayTest: {
        passed: false,
        reason:
          'Deposit and payout both depend on the swap service. If it stops, funds in transit are lost or refunded at its discretion.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'Cake Wallet and Monero are open source. The swap services run closed systems.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.bridged,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: moneroCakeWalletAdversaries,
    riskSummary: readProjectMarkdown('monero-cake-wallet', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'monero-cake-wallet',
        'upgradesAndGovernance',
      ),
    },
  },
}
